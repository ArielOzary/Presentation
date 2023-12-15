namespace AutoLog.Domain.Entities;

public class CompanyContact : BaseEntity
{
    public int CompanyId { get; set; }

    public Company Company { get; set; } = null!;

    public string Name { get; set; } = string.Empty;

    public string JobTitle { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Fax { get; set; } = string.Empty;

    public CompanyContactType ContactType { get; set; }
}
