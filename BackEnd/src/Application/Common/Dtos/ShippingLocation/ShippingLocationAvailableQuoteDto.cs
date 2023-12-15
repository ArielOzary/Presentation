using AutoLog.Application.Common.Constants;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.ShippingLocation;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.ShippingLocationAvailableQuoteDto)]
public class ShippingLocationAvailableQuoteDto : ShippingLocationDto
{
}
