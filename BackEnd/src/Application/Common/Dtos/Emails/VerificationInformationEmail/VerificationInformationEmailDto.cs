namespace AutoLog.Application.Common.Dtos.Emails.VerificationInformationEmail;

public class VerificationInformationEmailDto : BaseEmailDto
{
    public string Token { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;
}
