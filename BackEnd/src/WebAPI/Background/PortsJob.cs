using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace WebAPI.Background;

/// <summary>
/// Background job to seed ports
/// </summary>
public class PortsJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PeriodicTimer _periodicTimer;
    private readonly BackgroundJobOptions _options;
    private readonly ILogger<PortsJob> _logger;

    public PortsJob(
        IServiceProvider serviceProvider,
        IOptions<BackgroundJobOptions> options,
        ILogger<PortsJob> logger)
    {
        _options = options.Value;
        _periodicTimer = new(TimeSpan.FromDays(_options.PortsPeriodInDays));
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
                var portsSeeder = scope.ServiceProvider.GetRequiredService<IPortsSeeder>();

                await portsSeeder.SeedAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex.StackTrace);
            }
        }
    }
}
