using AutoLog.Application.Common.MassTransit.Requests;

namespace AutoLog.Application.Common.Interfaces;

public interface IParserHandlerService
{
    Task HandleAsync(ShipmentDataRequest shipmentDataRequest);

    Task HandleStatusesAsync(CancellationToken cancellationToken);
}
