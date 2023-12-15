using AutoLog.Application.Common.Dtos.CurrencyExchangeRate;
using AutoLog.Application.CurrencyExchangeRates.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/currency-exchange-rates")]
public sealed class CurrencyExchangeRatesController : ApiControllerBase
{
    [HttpGet]
    public async Task<List<BaseCurrencyRatesDto>> GetExchangeRates()
    {
        return await Mediator.Send(new GetExchangeRatesQuery());
    }
}
