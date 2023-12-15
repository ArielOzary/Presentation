using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Application.Common.Dtos.ProviderInfo;

namespace AutoLog.Application.FreightForwarders.Queries.GetFreightForwarders;

public sealed class FreightForwarderDto
{
    public string Id { get; set; } = string.Empty;

    public bool IsDeactivated { get; set; }

    public string CompanyNameEn { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Fax { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public CompanyContactProfileDto PaymentContact { get; set; } = null!;

    public ProviderInfoDisplayDto ProviderInfo { get; set; } = null!;
}
