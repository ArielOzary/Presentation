using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.Emails.Reminder.RemindClient;

public sealed class RemindClientEmailDataDto
{
    [JsonProperty(PropertyName = "SUBJECT", NamingStrategyType = typeof(DefaultNamingStrategy))]
    public string Subject { get; set; } = string.Empty;

    public string Reminder { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string ForwarderAction { get; set; } = string.Empty;
}
