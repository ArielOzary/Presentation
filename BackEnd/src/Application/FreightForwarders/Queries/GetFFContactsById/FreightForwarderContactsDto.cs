using AutoLog.Application.Common.Dtos.Company.CompanyContact;

namespace AutoLog.Application.FreightForwarders.Queries.GetFFContactsById;

public class FreightForwarderContactsDto
{
    public List<CompanyContactProfileDto> CompanyContacts { get; set; } = new();
}
