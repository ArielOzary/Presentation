using AutoLog.Application.Common.Dtos.CurrencyExchangeRate;
using AutoLog.Application.Common.Interfaces;
using MediatR;

namespace AutoLog.Application.CurrencyExchangeRates.Queries;

public sealed class GetExchangeRatesQuery : IRequest<List<BaseCurrencyRatesDto>>
{
}

public sealed class GetExchangeRatesQueryHandler : IRequestHandler<GetExchangeRatesQuery, List<BaseCurrencyRatesDto>>
{
    private readonly ICurrencyExchangeRateService _currencyExchangeRateService;

    public GetExchangeRatesQueryHandler(ICurrencyExchangeRateService currencyExchangeRateService)
    {
        _currencyExchangeRateService = currencyExchangeRateService;
    }

    public async Task<List<BaseCurrencyRatesDto>> Handle(GetExchangeRatesQuery request, CancellationToken cancellationToken)
    {
        return await _currencyExchangeRateService.GetExchangeRatesAsync();
    }
}
