using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Application.Common.Dtos.Company.CompanyLocation;

namespace AutoLog.Application.Clients.Queries.GetClientProfileById;

public sealed class ClientProfileDto
{
    public double TotalProfit { get; set; }

    public CompanyProfileDto? CompanyProfile { get; set; }

    public CompanyContactClientProfileDto? CompanyContact { get; set; }

    public CompanyLocationProfileDto? CompanyLocation { get; set; }
}
