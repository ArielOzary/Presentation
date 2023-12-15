namespace AutoLog.Domain.Entities;

public sealed class ReminderEmail
{
    public string Email { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public string ForwarderName { get; set; } = string.Empty;

    public string ClientFirstName { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public string LatestUpdate { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;

    public DateTime DateToRemind { get; set; }
}
