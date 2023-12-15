using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Clients.ClientProfits;
using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.Rate;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;
using MassTransit;

namespace AutoLog.Application.Common.MassTransit.Requests;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.Type)]
public sealed class QuoteCalculationInfoRequest
{
    public ShippingTypeAvailableQuoteDto ShippingType { get; set; } = null!;

    public ShippingLocationAvailableQuoteDto Destination { get; set; } = null!;

    public ShippingLocationAvailableQuoteDto Origin { get; set; } = null!;

    public QuoteGoodAvailableQuoteDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadAvailableQuoteDto> QuoteLoads { get; set; } = null!;

    public List<RateAvailableQuoteDto> Rates { get; set; } = null!;

    public ClientChargeProfitsDto ClientChargeProfits { get; set; } = null!;
}
