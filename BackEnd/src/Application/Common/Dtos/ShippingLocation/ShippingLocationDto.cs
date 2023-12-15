namespace AutoLog.Application.Common.Dtos.ShippingLocation;

public class ShippingLocationDto
{
    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string? Zip { get; set; }

    public string Address { get; set; } = string.Empty;

    public int? PortId { get; set; }

    public string? PortName { get; set; }
}
