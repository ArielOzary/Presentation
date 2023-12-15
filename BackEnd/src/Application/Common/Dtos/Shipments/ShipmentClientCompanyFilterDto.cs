namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentClientCompanyFilterDto
{
    public List<string>? ClientIds { get; set; }

    public List<int>? CompanyIds { get; set; }
}
