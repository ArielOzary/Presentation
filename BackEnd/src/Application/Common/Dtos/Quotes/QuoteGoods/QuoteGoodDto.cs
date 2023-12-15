using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;

public class QuoteGoodDto
{
    public CurrencyType CurrencyType { get; set; }

    public double Value { get; set; }

    public bool Dangerous { get; set; }

    public int UN { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime? ShippingDate { get; set; }

    public bool IsKnownShipper { get; set; }
}
