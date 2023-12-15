namespace AutoLog.Application.Common.Dtos.Reminders;

public sealed class ReminderDataDto
{
    public string Subject { get; set; } = string.Empty;

    public string ForwarderAction { get; set; } = string.Empty;

    public string Reminder { get; set; } = string.Empty;

    public string LatestUpdate { get; set; } = string.Empty;
}

