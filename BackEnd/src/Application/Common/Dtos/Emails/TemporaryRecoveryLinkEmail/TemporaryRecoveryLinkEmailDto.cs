namespace AutoLog.Application.Common.Dtos.Emails.TemporaryRecoveryLinkEmail;

public class TemporaryRecoveryLinkEmailDto : BaseEmailDto
{
    public string Token { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;
}
