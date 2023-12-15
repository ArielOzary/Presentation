using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace WebAPI.Background;

/// <summary>
/// Background job to deactivate rates
/// </summary>
public sealed class DeactivateRatesJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PeriodicTimer _periodicTimer;
    private readonly BackgroundJobOptions _options;
    private readonly ILogger<DeactivateRatesJob> _logger;

    public DeactivateRatesJob(
        IServiceProvider serviceProvider,
        IOptions<BackgroundJobOptions> options,
        ILogger<DeactivateRatesJob> logger)
    {
        _options = options.Value;
        _periodicTimer = new(TimeSpan.FromSeconds(_options.RatePeriodInSeconds));
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

                await quoteRateNotifierService.DeactivateRatesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex.StackTrace);
            }
        }
    }
}