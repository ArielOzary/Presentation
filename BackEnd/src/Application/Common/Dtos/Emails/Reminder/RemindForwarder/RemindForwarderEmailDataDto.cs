using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.Emails.Reminder.RemindForwarder;

public sealed class RemindForwarderEmailDataDto
{
    [JsonProperty(PropertyName = "SUBJECT", NamingStrategyType = typeof(DefaultNamingStrategy))]
    public string Subject { get; set; } = string.Empty;

    public string ForwarderName { get; set; } = string.Empty;

    public string ClientFirstName { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public string LatestUpdate { get; set; } = string.Empty;
}
