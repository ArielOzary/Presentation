namespace AutoLog.Application.Common.Dtos.ShippingLocation;

public class ShippingLocationCreateDto
{
    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Zip { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public int? PortId { get; set; }

    public string PortName { get; set; } = string.Empty;
}
