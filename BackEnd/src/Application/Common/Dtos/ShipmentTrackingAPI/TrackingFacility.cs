using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingFacility
{
    public int Id { get; set; }

    public string? Name { get; set; }

    [JsonPropertyName("country_code")]
    public string? CountryCode { get; set; }

    public string? Locode { get; set; }

    [JsonPropertyName("bic_code")]
    public string? BicCode { get; set; }

    [JsonPropertyName("smdg_code")]
    public string? SmdgCode { get; set; }

    public float? Lat { get; set; }

    public float? Lng { get; set; }
}
