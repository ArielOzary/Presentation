namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentSearchFilterDto
{
    public string? ContainerNumberOrVesselName { get; set; }

    public string? Search { get; set; }
}
