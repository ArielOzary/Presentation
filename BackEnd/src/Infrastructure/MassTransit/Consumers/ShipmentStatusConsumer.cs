using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.MassTransit.Requests;
using MassTransit;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace AutoLog.Infrastructure.MassTransit.Consumers;

public sealed class ShipmentStatusConsumer : IConsumer<NewShipmentStatusInfoRequest>
{
    private readonly IParserHandlerService _handlerService;
    private readonly ILogger<ShipmentStatusConsumer> _logger;
    public ShipmentStatusConsumer(
        IParserHandlerService handlerService, ILogger<ShipmentStatusConsumer> logger)
    {
        _handlerService = handlerService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<NewShipmentStatusInfoRequest> context)
    {
        try
        {
            _logger.LogInformation("We get the next data from email:" + context.Message.Data);
            var shipmentDataRequest = JsonConvert.DeserializeObject<ShipmentDataRequest>(context.Message.Data)!;

            await _handlerService.HandleAsync(shipmentDataRequest);

            return;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            throw;
        }

    }
}
