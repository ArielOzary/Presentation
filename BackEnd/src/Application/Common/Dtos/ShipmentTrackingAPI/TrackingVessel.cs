using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingVessel
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Imo { get; set; }

    [JsonPropertyName("call_sign")]
    public string CallSign { get; set; } = string.Empty;

    public int Mmsi { get; set; }

    public string Flag { get; set; } = string.Empty;
}
