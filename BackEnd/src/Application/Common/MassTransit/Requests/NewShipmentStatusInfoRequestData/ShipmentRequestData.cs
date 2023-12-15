namespace AutoLog.Application.Common.MassTransit.Requests.NewShipmentStatusInfoRequestData;

public sealed class ShipmentRequestData
{
    public string ShoNo { get; set; } = string.Empty;

    public string PoNumber { get; set; } = string.Empty;

    public string Mode { get; set; } = string.Empty;

    public string OpenDate { get; set; } = string.Empty;

    public string Origin { get; set; } = string.Empty;

    public string Importer { get; set; } = string.Empty;

    public string ShoStatus { get; set; } = string.Empty;

    public string SupplierName { get; set; } = string.Empty;

    public string Atd { get; set; } = string.Empty;

    public string Comments { get; set; } = string.Empty;

    public string Eta { get; set; } = string.Empty;

    public string ShoShipDetails { get; set; } = string.Empty;
}
