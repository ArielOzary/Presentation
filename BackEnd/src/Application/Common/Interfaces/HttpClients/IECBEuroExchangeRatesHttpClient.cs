using AutoLog.Application.Common.Dtos.CurrencyExchangeRate;

namespace AutoLog.Application.Common.Interfaces.HttpClients;

/// <summary>
/// Http client to work with european central bank currencies
/// </summary>
public interface IECBEuroExchangeRatesHttpClient
{
    /// <summary>
    /// Method to get currency rates
    /// </summary>
    /// <returns>Currency rates</returns>
    Task<ECBExchangeRateResponseDto> GetEuroExchangeRatesAsync();
}
