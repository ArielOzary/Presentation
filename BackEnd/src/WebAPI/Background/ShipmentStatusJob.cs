using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace WebAPI.Background;

public class ShipmentStatusJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly PeriodicTimer _periodicTimer;
    private readonly BackgroundJobOptions _options;
    private readonly ILogger<ShipmentStatusJob> _logger;

    public ShipmentStatusJob(
        IServiceProvider serviceProvider,
        IOptions<BackgroundJobOptions> options,
        ILogger<ShipmentStatusJob> logger)
    {
        _options = options.Value;
        _periodicTimer = new(TimeSpan.FromSeconds(_options.ShipmentStatusesPeriodInSeconds));
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
                var handler = scope.ServiceProvider.GetRequiredService<IParserHandlerService>();

                await handler.HandleStatusesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex.StackTrace);
            }
        }
    }
}
