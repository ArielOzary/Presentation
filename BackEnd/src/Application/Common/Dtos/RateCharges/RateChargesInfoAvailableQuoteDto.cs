using AutoLog.Application.Common.Constants;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.RateCharges;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.RateChargesInfoAvailableQuoteDto)]
public class RateChargesInfoAvailableQuoteDto : RateChargesInfoDto
{
}
