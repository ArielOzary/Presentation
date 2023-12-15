using AutoLog.Domain.Enums;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.Quotes;

[MessageUrn(Constants.MassTransitTypes.QuoteCalculationAvailableListResponseTypes.QuoteFeeItem)]
public class QuoteFeeItem
{
    public double UnitsQuantity { get; set; }

    public double UnitPrice { get; set; }

    public double Amount { get; set; }

    public CurrencyType Currency { get; set; }

    public string Comment { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// If TRUE = Display that item but don`t calc in total amount;
    /// If FALSE = Display that item and calc in total amount
    /// </summary>
    public bool ItemRequired { get; set; }
}
