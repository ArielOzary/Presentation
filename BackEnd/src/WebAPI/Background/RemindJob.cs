using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace WebAPI.Background;

/// <summary>
/// Background job to remind forwarders to do needed actions
/// </summary>
public sealed class RemindJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PeriodicTimer _periodicTimer;
    private readonly BackgroundJobOptions _options;
    private readonly ILogger<RemindJob> _logger;

    public RemindJob(
        IServiceProvider serviceProvider,
        IOptions<BackgroundJobOptions> options,
        ILogger<RemindJob> logger)
    {
        _options = options.Value;
        _periodicTimer = new(TimeSpan.FromSeconds(_options.RemindPeriodInSeconds));
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
                var reminderService = scope.ServiceProvider.GetRequiredService<IReminderService>();

                await reminderService.RemindAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError("{Message}, {StackTrace}", ex.Message, ex.StackTrace);
            }
        }
    }
}
