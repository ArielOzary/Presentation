namespace AutoLog.Application.Companies.Queries.GetFFDtoByCompanyId;

public sealed class FreightForwarderCompanyDto
{
    public string Id { get; set; } = string.Empty;

    public int CompanyId { get; set; }

    public string CompanyNameEn { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Fax { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}
