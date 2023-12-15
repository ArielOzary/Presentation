namespace AutoLog.Application.Common.Dtos.Emails.VerificationInformationEmail;
public class VerificationInformationEmailDataDto : BaseEmailDataTokenDto
{
    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;
}
