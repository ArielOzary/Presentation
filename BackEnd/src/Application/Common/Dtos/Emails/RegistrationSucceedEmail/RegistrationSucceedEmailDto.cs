namespace AutoLog.Application.Common.Dtos.Emails.AdminRegistrationSucceedEmail;
public class RegistrationSucceedEmailDto : BaseEmailDto
{
    public string Password { get; set; } = string.Empty;
}
