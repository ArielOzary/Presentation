using MassTransit;

namespace AutoLog.Application.Common.Dtos.Quotes;

[MessageUrn(Constants.MassTransitTypes.QuoteCalculationAvailableListResponseTypes.QuoteFees)]
public class QuoteFees
{
    public List<QuoteFeeItem> Items { get; set; } = new();

    public double SubTotal => Items != null ? Items.Where(x => x.ItemRequired == false).Sum(x => x.Amount) : 0d;
}
