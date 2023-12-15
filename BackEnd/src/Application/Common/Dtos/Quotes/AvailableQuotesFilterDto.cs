using AutoLog.Application.Common.Dtos.Filtering;
using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Quotes;

public class AvailableQuotesFilterDto
{
    public CurrencyType? CurrencyTypeFilter { get; set; }

    public SelectFilterDto<DateTime>? ExpirationDateFilter { get; set; }

    public OptionsFilterDto<int>? CompanyIdsFilter { get; set; }

    public PriceRangeFilterDto<double>? PriceRangeFilter { get; set; }

    public bool SortDescending { get; set; } = false;

    public AvailableQuotesSortOption? SortingFilter { get; set; }

    public SearchFilterDto? SearchQuery { get; set; }

    public List<ShipmentOption>? ShipmentOptions { get; set; }
}
