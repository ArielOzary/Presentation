using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public class ShipmentFilterDto
{
    public ShipmentClientCompanyFilterDto? ClientCompanyFilter { get; set; }

    public ShipmentSearchFilterDto? SearchFilter { get; set; }

    public ShipmentTOSFilterDto? TOSFilter { get; set; }

    public ShipmentSortOption? SortOption { get; set; }
}
