using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.NewAvailableQuotes;
using AutoLog.Application.Common.Dtos.Quotes;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.MassTransit.Requests;
using AutoLog.Application.Common.MassTransit.Responses;
using MassTransit;

namespace AutoLog.Infrastructure.MassTransit;

#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
public class MassTransitService : IMassTransitService
{
    private readonly IRequestClient<QuoteCalculationInfoRequest> _quoteCalculationClient;
    private readonly IRequestClient<NewAvailableQuotesCalculationRequest> _availableQuotesClient;

    public MassTransitService(
        IRequestClient<QuoteCalculationInfoRequest> quoteCalculationClient,
        IRequestClient<NewAvailableQuotesCalculationRequest> availableQuotesClient)

    {
        _quoteCalculationClient = quoteCalculationClient;
        _availableQuotesClient = availableQuotesClient;
    }

    public async Task<List<QuoteResponseDto>> GetAvailableQuotesAsync(NewAvailableQuotesCalculationRequest request)
    {
        var response = await _availableQuotesClient.GetResponse<NewAvailableQuotesCalculationResponse, MassTransitExceptionResponse>(request);

        if (response.Is(out Response<NewAvailableQuotesCalculationResponse> result))
        {
            return result.Message.Response;
        }
        HandleException(response);

        return default!;
    }

    public async Task<List<QuoteDto>> SendRequestToQuotesCalculationAsync(QuoteCalculationInfoRequest request)
    {
        var response = await _quoteCalculationClient.GetResponse<QuoteCalculationAvailableListResponse, MassTransitExceptionResponse>(request);

        if (response.Is(out Response<QuoteCalculationAvailableListResponse> result))
        {
            return result.Message.Quotes;
        }
        HandleException(response);

        return Enumerable.Empty<QuoteDto>().ToList();
    }

    private static void HandleException<T>(Response<T, MassTransitExceptionResponse> response)
        where T : class
    {
        if (response.Is(out Response<MassTransitExceptionResponse> error))
        {
            throw new AutoLogException($"MassTransit Exception Message:{error.Message.Message}\n MassTransit StackTrace:{error.Message.StackTrace} \n", ErrorCodes.QUOTES_CALCULATIONS_API_ERROR);
        }
    }
}
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.
