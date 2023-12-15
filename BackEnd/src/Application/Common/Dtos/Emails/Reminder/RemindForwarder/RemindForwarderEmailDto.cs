﻿namespace AutoLog.Application.Common.Dtos.Emails.Reminder.RemindForwarder;

public sealed class RemindForwarderEmailDto : BaseEmailDto
{
    public string Subject { get; set; } = string.Empty;

    public string ForwarderName { get; set; } = string.Empty;

    public string ClientFirstName { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public string LatestUpdate { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;
}
