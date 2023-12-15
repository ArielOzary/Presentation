using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingEvent
{
    [JsonPropertyName("order_id")]
    public int OrderId { get; set; }

    public int Location { get; set; }

    public int? Facility { get; set; }

    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("event_type")]
    public string EventType { get; set; } = string.Empty;

    [JsonPropertyName("event_code")]
    public string EventCode { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string Date { get; set; } = string.Empty;

    public bool Actual { get; set; }

    [JsonPropertyName("is_additional_event")]
    public bool IsAdditionalEvent { get; set; }

    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("transport_type")]
    public string TransportType { get; set; } = string.Empty;

    public int? Vessel { get; set; }

    public string Voyage { get; set; } = string.Empty;
}
