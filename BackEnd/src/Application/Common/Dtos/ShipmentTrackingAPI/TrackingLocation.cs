using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingLocation
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    [JsonPropertyName("country_code")]
    public string CountryCode { get; set; } = string.Empty;

    public string Locode { get; set; } = string.Empty;

    public float Lat { get; set; }

    public float Lng { get; set; }

    public string Timezone { get; set; } = string.Empty;
}
