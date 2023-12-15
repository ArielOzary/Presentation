using AutoLog.Application.Common.Dtos.CurrencyExchangeRate;
using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to exchange currencies
/// </summary>
public interface ICurrencyExchangeRateService
{
    /// <summary>
    /// Method to get exchange rates
    /// </summary>
    /// <returns>Currenct exchange rates</returns>
    Task<List<BaseCurrencyRatesDto>> GetExchangeRatesAsync();

    /// <summary>
    /// Method to convert currency from given type to another
    /// </summary>
    /// <param name="currencyTypeFrom">Currency type to convert from</param>
    /// <param name="currencyTypeTo">Currency type to convert to</param>
    /// <param name="value">Value to convert</param>
    /// <returns>Converted value to currency type</returns>
    /// <exception cref="NotImplementedException">Exception thrown in case if currency type was out of range</exception>
    double ConvertFromToCurrency(CurrencyType typeFrom, CurrencyType typeTo, double value);
}
