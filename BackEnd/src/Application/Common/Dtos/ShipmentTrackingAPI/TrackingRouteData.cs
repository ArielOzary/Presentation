namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingRouteData
{
    public List<TrackingRoutePath> Route { get; set; } = new();

    public List<float> Pin { get; set; } = new();
}
