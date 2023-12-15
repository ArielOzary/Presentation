namespace AutoLog.Domain.Entities;

public class Quote : BaseAuditableEntity
{
    public string? UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public int? CompanyId { get; set; } // freight forwarder id

    public Company? Company { get; set; }

    public QuoteGood? QuoteGood { get; set; }

    public List<QuoteLoad>? QuoteLoads { get; set; }

    public int? ShippingTypeId { get; set; }

    public ShippingType? ShippingType { get; set; }

    public int? DestinationId { get; set; }

    public ShippingLocation? Destination { get; set; }

    public int? OriginId { get; set; }

    public ShippingLocation? Origin { get; set; }

    public Shipment? Shipment { get; set; }

    public bool HasShipment { get; set; }

    public bool IsNotified { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public int? RateId { get; set; }

    public bool IsCustom { get; set; }

    public List<QuoteFile> QuoteFiles { get; set; } = new();
}
