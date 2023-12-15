using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Company.CompanyContact;

public class CompanyContactProfileDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string JobTitle { get; set; } = string.Empty;

    public CompanyContactType ContactType { get; set; }
}
