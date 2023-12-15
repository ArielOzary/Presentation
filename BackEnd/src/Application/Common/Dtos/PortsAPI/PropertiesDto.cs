using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.PortsAPI;

public sealed class PropertiesDto
{
    [JsonPropertyName("country")]
    public CountryDto Country { get; set; } = null!;

    [JsonPropertyName("region")]
    public RegionDto? Region { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}
