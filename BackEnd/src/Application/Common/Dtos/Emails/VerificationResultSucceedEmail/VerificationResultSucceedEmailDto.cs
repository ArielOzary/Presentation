namespace AutoLog.Application.Common.Dtos.Emails.VerificationResultSucceedEmail;

public class VerificationResultSucceedEmailDto : BaseEmailDto
{
    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;
}
