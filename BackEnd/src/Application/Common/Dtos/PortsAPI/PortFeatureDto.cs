using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.PortsAPI;

public sealed class PortFeatureDto
{
    [JsonPropertyName("properties")]
    public PropertiesDto Properties { get; set; } = null!;

    [JsonPropertyName("geometry")]
    public GeometryDto Geometry { get; set; } = null!;
}
