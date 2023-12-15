using AutoLog.Application.Common.Constants;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.QuoteGoodAvailableQuoteDto)]
public class QuoteGoodAvailableQuoteDto : QuoteGoodDto
{
}
