using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingContainer
{
    public string Number { get; set; } = string.Empty;

    [JsonPropertyName("iso_code")]
    public string IsoCode { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public List<TrackingEvent> Events { get; set; } = new();
}
