namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class ShipmentTrackingRoot
{
    public string Message { get; set; } = string.Empty;

    public TrackingData Data { get; set; } = null!;
}
