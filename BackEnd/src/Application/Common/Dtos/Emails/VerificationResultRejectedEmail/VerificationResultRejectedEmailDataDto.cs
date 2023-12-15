namespace AutoLog.Application.Common.Dtos.Emails.VerificationResultRejectedEmail;

public class VerificationResultRejectedEmailDataDto : BaseEmailDataTokenDto
{
    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;
}
