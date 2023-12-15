namespace AutoLog.Application.Common.Dtos.Emails.AdminRegistrationInviteEmail;

public class AdminRegistrationInviteEmailDto : BaseEmailDto
{
    public string Token { get; set; } = string.Empty;
}
