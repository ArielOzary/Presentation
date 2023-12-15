using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.NewAvailableQuotes;
using MassTransit;

namespace AutoLog.Application.Common.MassTransit.Responses;

[MessageUrn(MassTransitTypes.AvailableQuotesResponseTypes.Type)]
public sealed class NewAvailableQuotesCalculationResponse
{
    public List<QuoteResponseDto> Response { get; set; } = new();
}
