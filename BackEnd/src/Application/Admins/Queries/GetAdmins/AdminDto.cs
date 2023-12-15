namespace AutoLog.Application.Admins.Queries.GetAdmins;

public class AdminDto
{
    public string Id { get; set; } = string.Empty;

    public bool IsDeactivated { get; set; }

    public string CompanyNameEn { get; set; } = string.Empty;

    public string ContactName { get; set; } = string.Empty;

    public string ContactPhoneNumber { get; set; } = string.Empty;

    public string ContactEmail { get; set; } = string.Empty;

    public string ContactJobTitle { get; set; } = string.Empty;
}
