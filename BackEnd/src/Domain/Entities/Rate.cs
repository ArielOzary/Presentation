namespace AutoLog.Domain.Entities;

public class Rate : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public bool IsDraft { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public int? FreightChargesId { get; set; }

    public RateCharges? FreightCharges { get; set; }

    public int? OriginChargesId { get; set; }

    public RateCharges? OriginCharges { get; set; }

    public int? DestinationChargesId { get; set; }

    public RateCharges? DestinationCharges { get; set; }

    public int? ShippingTypeId { get; set; }

    public ShippingType? ShippingType { get; set; }

    /// <summary>
    /// Another Freight Forwarder
    /// </summary>
    public int? CarrierId { get; set; }

    public Company? Carrier { get; set; }

    public int CompanyId { get; set; }

    public Company Company { get; set; } = null!;

    public List<Shipment> Shipments { get; set; } = new();
}
