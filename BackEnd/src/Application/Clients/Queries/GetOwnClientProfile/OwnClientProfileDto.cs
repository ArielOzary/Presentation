using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Application.Common.Dtos.Company.CompanyLocation;

namespace AutoLog.Application.Clients.Queries.GetOwnClientProfile;

public sealed class OwnClientProfileDto
{
    public double TotalProfit { get; set; }

    public CompanyProfileDto CompanyProfile { get; set; } = null!;

    public List<CompanyContactClientProfileDto> CompanyContacts { get; set; } = new();

    public CompanyLocationProfileDto CompanyLocation { get; set; } = null!;
}
