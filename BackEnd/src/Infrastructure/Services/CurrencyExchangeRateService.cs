using AutoLog.Application.Common.Dtos.CurrencyExchangeRate;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Interfaces.HttpClients;
using AutoLog.Domain.Enums;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service to exchange currencies
/// </summary>
public sealed class CurrencyExchangeRateService : ICurrencyExchangeRateService
{
    private const string ECBCacheKey = "ECBRates";
    private const int CacheDurationMinutes = 30;

    private const string CurrencyName_ILS = "ILS";
    private const string CurrencyName_USD = "USD";
    private const double OneUSD = 1;
    private const double OneISL = 1;

    private const int SymbolsAfterPoint = 3;

    private readonly IECBEuroExchangeRatesHttpClient _ecbExchangeRatesClient;
    private readonly IMemoryCache _memoryCache;

    private List<CurrencyRateDto> EuroRates { get; set; } = null!;

    public CurrencyExchangeRateService(IECBEuroExchangeRatesHttpClient ecbExchangeRatesClient,
        IMemoryCache memoryCache)
    {
        _ecbExchangeRatesClient = ecbExchangeRatesClient;
        _memoryCache = memoryCache;

        if (EuroRates is null)
        {
            GetEuroExchangeRatesAsync().GetAwaiter().GetType();
        }
    }

    /// <summary>
    /// Method to get exchange rates
    /// </summary>
    /// <returns>Currenct exchange rates</returns>
    public async Task<List<BaseCurrencyRatesDto>> GetExchangeRatesAsync()
    {
        return new List<BaseCurrencyRatesDto>()
        {
            new BaseCurrencyRatesDto
            {
                BaseCurrencyType = CurrencyType.EUR,
                CurrencyRates = await GetEuroExchangeRatesAsync(),
            },
            new BaseCurrencyRatesDto
            {
                BaseCurrencyType = CurrencyType.USD,
                CurrencyRates = GetUSDRates(),
            },
            new BaseCurrencyRatesDto
            {
                BaseCurrencyType = CurrencyType.NIS,
                CurrencyRates = GetNISRates(),
            }
        };
    }

    /// <summary>
    /// Method to receive euro exchange rates
    /// </summary>
    /// <returns>Euro exchange rates</returns>
    private async Task<List<CurrencyRateDto>> GetEuroExchangeRatesAsync()
    {
        EuroRates = await _memoryCache.GetOrCreateExclusiveAsync(ECBCacheKey, async cacheEntry =>
        {
            var cts = new CancellationTokenSource();
            cacheEntry.AddExpirationToken(new CancellationChangeToken(cts.Token));
            cts.CancelAfter(CacheDurationMinutes * 1000 * 60);

            var response = await _ecbExchangeRatesClient.GetEuroExchangeRatesAsync();
            EuroRates = response.RootCube.Cubes
            .First().Cubes
            .Where(x => x.Currency == CurrencyName_ILS || CurrencyName_USD == x.Currency).Select(x => new CurrencyRateDto
            {
                Rate = x.Rate,
                Type = x.Currency == CurrencyName_USD ? CurrencyType.USD : CurrencyType.NIS,
            }).ToList();

            return EuroRates;
        });

        return EuroRates;
    }

    /// <summary>
    /// Method to receive USD exchange rates
    /// </summary>
    /// <returns>USD exchange rates</returns>
    private List<CurrencyRateDto> GetUSDRates()
    {
        var usdToEuroRate = ConvertToEuro(CurrencyType.USD, OneUSD);
        var euroToIlsRate = EuroRates.Find(x => x.Type == CurrencyType.NIS)!.Rate;

        var usdToIlsRate = usdToEuroRate * euroToIlsRate;

        var result = new List<CurrencyRateDto>
        {
            new CurrencyRateDto
            {
                Type = CurrencyType.EUR,
                Rate = Math.Round(usdToEuroRate, SymbolsAfterPoint),
            },
            new CurrencyRateDto
            {
                Type = CurrencyType.NIS,
                Rate = Math.Round(usdToIlsRate, SymbolsAfterPoint),
            }
        };

        return result;
    }

    /// <summary>
    /// Method to receive NIS exchange rates
    /// </summary>
    /// <returns>NIS exchange rates</returns>
    private List<CurrencyRateDto> GetNISRates()
    {
        var usdToEuroRate = ConvertToEuro(CurrencyType.USD, OneUSD);
        var euroToIlsRate = EuroRates.Find(x => x.Type == CurrencyType.NIS)!.Rate;
        var usdToIlsRate = usdToEuroRate * euroToIlsRate;

        var ilsToEuroRate = ConvertToEuro(CurrencyType.NIS, OneISL);
        var ilsToUSDRate = OneISL / usdToIlsRate;

        var result = new List<CurrencyRateDto>
        {
            new CurrencyRateDto
            {
                Type = CurrencyType.EUR,
                Rate = Math.Round(ilsToEuroRate, SymbolsAfterPoint),
            },
            new CurrencyRateDto
            {
                Type = CurrencyType.USD,
                Rate = Math.Round(ilsToUSDRate, SymbolsAfterPoint),
            }
        };

        return result;
    }

    /// <summary>
    /// Method to convert currency from type to euro
    /// </summary>
    /// <param name="currencyType">Currency type</param>
    /// <param name="value">Value to convert</param>
    /// <returns>Value converted to euro</returns>
    /// <exception cref="NotImplementedException">Exception thrown if enum was out of range</exception>
    private double ConvertToEuro(CurrencyType currencyType, double value)
    {
        return currencyType switch
        {
            CurrencyType.USD => value / EuroRates.Find(x => x.Type == CurrencyType.USD)!.Rate,
            CurrencyType.EUR => value,
            CurrencyType.NIS => value / EuroRates.Find(x => x.Type == CurrencyType.NIS)!.Rate,
            _ => throw new NotImplementedException(),
        };
    }

    /// <summary>
    /// Method to convert currency from given type to another
    /// </summary>
    /// <param name="currencyTypeFrom">Currency type to convert from</param>
    /// <param name="currencyTypeTo">Currency type to convert to</param>
    /// <param name="value">Value to convert</param>
    /// <returns>Converted value to currency type</returns>
    /// <exception cref="NotImplementedException">Exception thrown in case if currency type was out of range</exception>
    public double ConvertFromToCurrency(CurrencyType currencyTypeFrom, CurrencyType currencyTypeTo, double value)
    {
        return currencyTypeFrom == currencyTypeTo
            ? value
            : (currencyTypeFrom, currencyTypeTo) switch
            {
                { currencyTypeFrom: CurrencyType.EUR, currencyTypeTo: CurrencyType.USD } => value * EuroRates.Find(x => x.Type == CurrencyType.USD)!.Rate,
                { currencyTypeFrom: CurrencyType.EUR, currencyTypeTo: CurrencyType.NIS } => value * EuroRates.Find(x => x.Type == CurrencyType.NIS)!.Rate,

                { currencyTypeFrom: CurrencyType.USD, currencyTypeTo: CurrencyType.EUR } => value * GetUSDRates().Find(x => x.Type == CurrencyType.EUR)!.Rate,
                { currencyTypeFrom: CurrencyType.USD, currencyTypeTo: CurrencyType.NIS } => value * GetUSDRates().Find(x => x.Type == CurrencyType.NIS)!.Rate,

                { currencyTypeFrom: CurrencyType.NIS, currencyTypeTo: CurrencyType.USD } => value * GetNISRates().Find(x => x.Type == CurrencyType.USD)!.Rate,
                { currencyTypeFrom: CurrencyType.NIS, currencyTypeTo: CurrencyType.EUR } => value * GetNISRates().Find(x => x.Type == CurrencyType.EUR)!.Rate,
                _ => throw new NotImplementedException(),
            };
    }
}
