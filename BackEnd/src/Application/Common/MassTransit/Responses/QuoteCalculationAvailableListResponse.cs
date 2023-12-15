using AutoLog.Application.Common.Dtos.Quotes;
using MassTransit;

namespace AutoLog.Application.Common.MassTransit.Responses;

[MessageUrn(Constants.MassTransitTypes.QuoteCalculationAvailableListResponseTypes.Type)]
public class QuoteCalculationAvailableListResponse
{
    public List<QuoteDto> Quotes { get; set; } = new();
}
