namespace AutoLog.Domain.Entities;

public sealed class RecentQuoteSearch : BaseAuditableEntity
{
    public string? UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public QuoteGood? QuoteGood { get; set; }

    public List<QuoteLoad>? QuoteLoads { get; set; }

    public int? ShippingTypeId { get; set; }

    public ShippingType? ShippingType { get; set; }

    public int? DestinationId { get; set; }

    public ShippingLocation? Destination { get; set; }

    public int? OriginId { get; set; }

    public ShippingLocation? Origin { get; set; }

    public bool IsKnownSupplier { get; set; }
}
