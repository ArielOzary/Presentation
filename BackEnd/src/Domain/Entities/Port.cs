namespace AutoLog.Domain.Entities;

public class Port : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public PortType PortType { get; set; }

    public string Country { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public double Longitude { get; set; }

    public double Latitude { get; set; }
}
