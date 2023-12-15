using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos;
using AutoLog.Application.Common.Dtos.Rate;
using MassTransit;

namespace AutoLog.Application.Common.MassTransit.Requests;

[MessageUrn(MassTransitTypes.AvailableQuotesRequestTypes.Type)]
public sealed class NewAvailableQuotesCalculationRequest
{
    public List<CustomRequestedQuoteDto> Quotes { get; set; } = null!;

    public List<RateAvailableQuoteDto> Rates { get; set; } = null!;
}
