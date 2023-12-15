using AutoLog.Application.Companies.Queries.GetFFCompanyNames;

namespace AutoLog.Application.Common.Dtos.Quotes;

public class AvailableQuotesListDto
{
    public List<QuoteDto> Quotes { get; set; } = new();

    public List<FreightForwarderCompanyNameDto> CompanyIdsFilterOptions { get; set; } = new();

    public double MinPriceFilterOption { get; set; }

    public double MaxPriceFilterOption { get; set; }
}
