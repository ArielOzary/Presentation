namespace AutoLog.Application.Common.Dtos.Company;

public class CompanyProfileDto
{
    public string NameEn { get; set; } = string.Empty;

    public string NameHe { get; set; } = string.Empty;

    public int? IndustryTypeId { get; set; }

    public string LegalNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}
