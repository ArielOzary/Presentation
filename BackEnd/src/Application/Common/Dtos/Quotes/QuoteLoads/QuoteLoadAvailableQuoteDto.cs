using AutoLog.Application.Common.Constants;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.QuoteLoadAvailableQuoteDto)]
public class QuoteLoadAvailableQuoteDto : QuoteLoadDto
{
}
