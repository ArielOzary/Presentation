using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace WebAPI.Background;

/// <summary>
/// Background job to notify users about available rates to their quotes
/// </summary>
public sealed class QuotesAvailabilityJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PeriodicTimer _periodicTimer;
    private readonly BackgroundJobOptions _options;
    private readonly ILogger<QuotesAvailabilityJob> _logger;

    public QuotesAvailabilityJob(
        IServiceProvider serviceProvider,
        IOptions<BackgroundJobOptions> options,
        ILogger<QuotesAvailabilityJob> logger)
    {
        _options = options.Value;
        _periodicTimer = new(TimeSpan.FromSeconds(_options.QuotePeriodInSeconds));
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (await _periodicTimer.WaitForNextTickAsync(cancellationToken) &&
            !cancellationToken.IsCancellationRequested)
        {
            try
            {
                using IServiceScope scope = _serviceProvider.CreateScope();
                var quoteRateNotifierService = scope.ServiceProvider.GetRequiredService<IQuoteRateNotifierService>();

                await quoteRateNotifierService.CheckQuotesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex.StackTrace);
            }
        }
    }
}
