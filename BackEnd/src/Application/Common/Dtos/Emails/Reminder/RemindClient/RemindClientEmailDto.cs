namespace AutoLog.Application.Common.Dtos.Emails.Reminder.RemindClient;

public sealed class RemindClientEmailDto : BaseEmailDto
{
    public string Subject { get; set; } = string.Empty;

    public string Reminder { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string ForwarderAction { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;
}
