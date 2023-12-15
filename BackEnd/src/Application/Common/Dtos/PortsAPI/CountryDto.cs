using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.PortsAPI;

public sealed class CountryDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("continent")]
    public string Continent { get; set; } = string.Empty;
}
