using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.PortsAPI;

public sealed class RegionDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}
