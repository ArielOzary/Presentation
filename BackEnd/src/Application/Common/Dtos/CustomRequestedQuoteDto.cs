using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;
using MassTransit;

namespace AutoLog.Application.Common.Dtos;

[MessageUrn(MassTransitTypes.AvailableQuotesRequestTypes.CustomRequestedQuoteDto)]
public sealed class CustomRequestedQuoteDto
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string UserEmail { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;

    public ShippingTypeAvailableQuoteDto ShippingType { get; set; } = null!;

    public ShippingLocationAvailableQuoteDto Destination { get; set; } = null!;

    public ShippingLocationAvailableQuoteDto Origin { get; set; } = null!;

    public QuoteGoodAvailableQuoteDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadAvailableQuoteDto> QuoteLoads { get; set; } = null!;
}
