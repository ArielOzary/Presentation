using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingData
{
    public List<TrackingLocation> Locations { get; set; } = new();

    public List<TrackingFacility> Facilities { get; set; } = new();

    public TrackingRoute Route { get; set; } = null!;

    public List<TrackingVessel> Vessels { get; set; } = new();

    public List<TrackingContainer> Containers { get; set; } = new();

    [JsonPropertyName("route_data")]
    public TrackingRouteData RouteData { get; set; } = null!;
}
