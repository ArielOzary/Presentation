namespace AutoLog.Domain.Entities;

public class ShippingLocation : BaseEntity
{
    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string? Zip { get; set; }

    public string Address { get; set; } = string.Empty;

    public string? State { get; set; }

    public int? PortId { get; set; }

    public Port? Port { get; set; }
}
