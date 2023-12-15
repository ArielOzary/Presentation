using AutoLog.Application.Common.Dtos;
using AutoLog.Application.Common.Dtos.Emails.AvailableCustomQuotes;
using AutoLog.Application.Common.Dtos.NewAvailableQuotes;
using AutoLog.Application.Common.Dtos.Rate;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.MassTransit.Requests;
using AutoLog.Infrastructure.Configurations;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.Threading;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service which notifies users about new quotes and deactivates rates
/// </summary>
public sealed class QuoteRateNotifierService : IQuoteRateNotifierService
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMassTransitService _massTransitService;
    private readonly IEmailService _emailService;
    private readonly BackgroundJobOptions _options;

    public QuoteRateNotifierService(
        IApplicationDbContext context,
        IMapper mapper,
        IMassTransitService massTransitService,
        IEmailService emailService,
        IOptions<BackgroundJobOptions> options)
    {
        _context = context;
        _mapper = mapper;
        _massTransitService = massTransitService;
        _emailService = emailService;
        _options = options.Value;
    }

    /// <summary>
    /// Method to check if there are new rates to quotes
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task CheckQuotesAsync(int freightForwardCompanyId, CancellationToken cancellationToken)
    {
        var rates = await _context.Rates
            .Where(x => x.CompanyId == freightForwardCompanyId && !x.IsDraft 
                    && x.Created >= DateTime.UtcNow.AddHours(_options.RateRange) && x.LastModified >= DateTime.UtcNow.AddHours(_options.RateRange))
            .ProjectTo<RateAvailableQuoteDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

        var quotes = await _context.Quotes
            .Where(x => !x.HasShipment && !x.IsNotified && x.CompanyId == freightForwardCompanyId)
            .ProjectTo<CustomRequestedQuoteDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

        var result = await _massTransitService.GetAvailableQuotesAsync(new NewAvailableQuotesCalculationRequest
        {
            Rates = rates,
            Quotes = quotes
        });

        foreach (var user in result)
        {
            SendQuoteNotification(user);
        }

        await _context.Quotes
            .Where(x => result.Select(x => x.UserId).Contains(x.UserId))
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsNotified, true), cancellationToken);
    }

    /// <summary>
    /// Method to check if there are new rates to quotes
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task CheckQuotesAsync(CancellationToken cancellationToken)
    {
        var rates = await _context.Rates
            .Where(x => x.Created >= DateTime.UtcNow.AddHours(_options.RateRange) && x.LastModified >= DateTime.UtcNow.AddHours(_options.RateRange))
            .ProjectTo<RateAvailableQuoteDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

        var quotes = await _context.Quotes
            .Where(x => !x.HasShipment && !x.IsNotified)
            .ProjectTo<CustomRequestedQuoteDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

        var result = await _massTransitService.GetAvailableQuotesAsync(new NewAvailableQuotesCalculationRequest
        {
            Rates = rates,
            Quotes = quotes
        });

        foreach (var user in result)
        {
            SendQuoteNotification(user);
        }

        await _context.Quotes
            .Where(x => result.Select(x => x.UserId).Contains(x.UserId))
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsNotified, true), cancellationToken);
    }

    /// <summary>
    /// Method to deactivate rates
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task DeactivateRatesAsync(CancellationToken cancellationToken)
    {
        await _context.Rates
            .Where(x => x.EndDate <= DateTime.UtcNow)
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsDraft, true), cancellationToken);
    }

    /// <summary>
    /// Method to send notification about available new quotes
    /// </summary>
    /// <param name="quoteResponse">Available quote with rates</param>
    private void SendQuoteNotification(QuoteResponseDto quoteResponse)
    {
        var emailOwnDto = new AvailableCustomQuoteEmailDto
        {
            Email = quoteResponse.UserEmail,
            QUOTE_ID = quoteResponse.QuoteId,
            RateOptions = quoteResponse.Rates,
            FirstName = quoteResponse.Username,
            Locale = quoteResponse.Locale
        };

        _emailService.SendAvailableCustomQuoteAsync(emailOwnDto).Forget();
    }
}
