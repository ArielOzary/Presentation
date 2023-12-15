using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.CurrencyExchangeRate;

public class BaseCurrencyRatesDto
{
    public string Name => Enum.GetName(BaseCurrencyType)!;

    public CurrencyType BaseCurrencyType { get; set; }

    public List<CurrencyRateDto> CurrencyRates { get; set; } = new();
}
