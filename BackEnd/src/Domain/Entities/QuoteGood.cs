namespace AutoLog.Domain.Entities;

public class QuoteGood : BaseEntity
{
    public CurrencyType CurrencyType { get; set; }

    public double Value { get; set; }

    public bool Dangerous { get; set; }

    public int UN { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime? ShippingDate { get; set; }

    public bool IsKnownShipper { get; set; }

    public int? QuoteId { get; set; }

    public Quote? Quote { get; set; }

    public int? RecentQuoteSearchId { get; set; }

    public RecentQuoteSearch? RecentQuoteSearch { get; set; }
}
