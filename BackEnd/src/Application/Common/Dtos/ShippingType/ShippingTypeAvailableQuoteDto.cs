using AutoLog.Application.Common.Constants;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.ShippingType;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.ShippingTypeAvailableQuoteDto)]
public class ShippingTypeAvailableQuoteDto : ShippingTypeDto
{
}
