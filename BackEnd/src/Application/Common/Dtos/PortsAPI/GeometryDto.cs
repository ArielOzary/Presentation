using System.Text.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.PortsAPI;

public sealed class GeometryDto
{
    [JsonPropertyName("coordinates")]
    public double[] Coordinates { get; set; } = null!;
}
