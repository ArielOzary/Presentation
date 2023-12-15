using AutoLog.Application.Common.Dtos.NewAvailableQuotes;
using AutoLog.Application.Common.Dtos.Quotes;
using AutoLog.Application.Common.MassTransit.Requests;

namespace AutoLog.Application.Common.Interfaces;

public interface IMassTransitService
{
    Task<List<QuoteDto>> SendRequestToQuotesCalculationAsync(QuoteCalculationInfoRequest request);

    Task<List<QuoteResponseDto>> GetAvailableQuotesAsync(NewAvailableQuotesCalculationRequest request); // TODO: rename
}
