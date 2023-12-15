using AutoLog.Domain.Enums;

namespace AutoLog.Application.Ports.Queries;

public sealed class PortDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public PortType PortType { get; set; }

    public string Country { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public double Longitude { get; set; }

    public double Latitude { get; set; }
}
