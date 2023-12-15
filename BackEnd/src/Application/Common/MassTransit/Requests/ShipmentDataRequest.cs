using AutoLog.Application.Common.MassTransit.Requests.NewShipmentStatusInfoRequestData;

namespace AutoLog.Application.Common.MassTransit.Requests;

public sealed class ShipmentDataRequest
{
    public EmailRequestData? EmailData { get; set; }

    public AttachmentsRequestData? AttachmentsData { get; set; }
}
