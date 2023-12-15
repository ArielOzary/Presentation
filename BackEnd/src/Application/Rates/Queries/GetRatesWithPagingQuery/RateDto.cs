using AutoLog.Application.Common.Dtos.ShippingType;

namespace AutoLog.Application.Rates.Queries.GetRatesWithPagingQuery;

public sealed class RateDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsDraft { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public ShippingTypeDto ShippingType { get; set; } = null!;

    public int? CarrierId { get; set; }

    public int CompanyId { get; set; }
}
