using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.PortsAPI;

public sealed class PortResponseDto
{
    [JsonPropertyName("features")]
    public List<PortFeatureDto> Ports { get; set; } = new();
}
