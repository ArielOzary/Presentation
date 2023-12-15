using AutoLog.Application.Common.Dtos.Emails.NewQuoteRequestEmail;
using AutoLog.Application.Common.Dtos.Emails.QuoteRequestRecieved;
using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Threading;
using Newtonsoft.Json;

namespace AutoLog.Application.Quotes.Commands.RequestCustomQuoteCommand;

public sealed class RequestCustomQuoteCommand : IRequest<List<int>>
{
    public bool IsKnownSupplier { get; set; }

    public List<int> CompanyIds { get; set; } = null!;

    public ShippingTypeCreateDto ShippingType { get; set; } = null!;

    public ShippingLocationCreateDto Destination { get; set; } = null!;

    public ShippingLocationCreateDto Origin { get; set; } = null!;

    public QuoteGoodCreateDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadCreateDto> QuoteLoads { get; set; } = null!;

    public string Remarks { get; set; } = string.Empty;

    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;
}

public sealed class RequestCustomQuoteCommandHandler : IRequestHandler<RequestCustomQuoteCommand, List<int>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmailService _emailService;

    public RequestCustomQuoteCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IEmailService emailService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _emailService = emailService;
    }

    public async Task<List<int>> Handle(RequestCustomQuoteCommand request, CancellationToken cancellationToken)
    {
        request.UserId = _currentUserService.UserId!;
        var companyId = _currentUserService.CompanyId;
        var email = _currentUserService.Email!;

        var newQuotes = await AddQuotesAsync(request, cancellationToken);

        var clientContactName = await _context.CompanyContacts
            .Where(x => x.CompanyId == companyId && x.ContactType == CompanyContactType.Basic)
            .Select(x => x.Name)
            .FirstOrDefaultAsync(cancellationToken);

        // After creating quotes we need to notify freight forwarders about creating new quotes
        foreach (var id in request.CompanyIds)
        {
            SendNotificationToFreightForwarderAsync(newQuotes, clientContactName, id, cancellationToken).Forget();
        }

        SendOwnQuoteNotification(email, clientContactName!);

        return newQuotes.Select(x => x.Id).ToList();
    }

    private async Task<List<Quote>> AddQuotesAsync(RequestCustomQuoteCommand request, CancellationToken cancellationToken)
    {
        var newQuotes = new List<Quote>();
        // Quotes need to be added to all companies coming from request
        foreach (var id in request.CompanyIds)
        {
            var newQuote = _mapper.Map<Quote>(request);
            newQuote.CompanyId = id;
            newQuote.IsCustom = true;
            newQuotes.Add(newQuote);
        }

        await _context.Quotes.AddRangeAsync(newQuotes, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return newQuotes;
    }

    private async Task SendNotificationToFreightForwarderAsync(List<Quote> newQuotes, string? clientContactName,
        int item, CancellationToken cancellationToken)
    {
        var freightForwarderContactName = await _context.CompanyContacts
            .Where(x => x.CompanyId == item && x.ContactType == CompanyContactType.Payment)
            .Select(x => x.Name)
            .FirstOrDefaultAsync(cancellationToken);

        var freightForwarderData = await _context.Users
            .Where(x => x.Company.Id == item)
            .Select(x => new { x.Locale, x.Email })
            .FirstOrDefaultAsync(cancellationToken);

        var emailDto = new NewQuoteRequestEmailDto
        {
            FreightForwarderName = freightForwarderContactName!,
            ClientName = clientContactName!,
            Email = freightForwarderData!.Email!,
            Locale = freightForwarderData.Locale,
            QuoteId = newQuotes.Where(x => x.CompanyId == item).Select(x => x.Id).FirstOrDefault(),
        };

        _emailService.SendNewQuoteRequestAsync(emailDto).Forget();
    }

    private void SendOwnQuoteNotification(string email, string clientContactName)
    {
        var emailOwnDto = new QuoteRequestRecievedEmailDto
        {
            ClientName = clientContactName,
            Email = email,
        };

        _emailService.SendQuoteRequestRecievedAsync(emailOwnDto).Forget();
    }
}
