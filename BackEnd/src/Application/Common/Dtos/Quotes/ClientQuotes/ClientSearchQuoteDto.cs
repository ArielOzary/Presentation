using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;

namespace AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;

public class ClientSearchQuoteDto
{
    public QuoteGoodDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadDto> QuoteLoads { get; set; } = new();

    public ShippingTypeDto ShippingType { get; set; } = null!;

    public ShippingLocationDto Destination { get; set; } = null!;

    public ShippingLocationDto Origin { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
}
