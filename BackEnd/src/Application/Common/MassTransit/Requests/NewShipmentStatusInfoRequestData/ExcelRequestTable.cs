namespace AutoLog.Application.Common.MassTransit.Requests.NewShipmentStatusInfoRequestData;

public sealed class ExcelRequestTable
{
    public List<string>? Titles { get; set; }

    public List<ShipmentRequestData>? Shipments { get; set; }
}
