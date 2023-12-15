using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.CurrencyExchangeRate;

public class CurrencyRateDto
{
    public string Name => Enum.GetName(Type)!;

    public CurrencyType Type { get; set; }

    public double Rate { get; set; }
}
