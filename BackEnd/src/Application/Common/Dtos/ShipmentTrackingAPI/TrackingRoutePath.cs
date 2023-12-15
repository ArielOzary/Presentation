namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingRoutePath
{
    public List<List<float>> Path { get; set; } = new();

    public string Type { get; set; } = string.Empty;
}
