using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.ProviderInfo;

namespace AutoLog.Application.FreightForwarders.Queries.GetFFBasicInfoById;

public class FreightForwarderBasicInfoDto
{
    public CompanyFFProfileDto CompanyProfile { get; set; } = null!;

    public ProviderInfoDisplayDto ProviderInfo { get; set; } = null!;
}
