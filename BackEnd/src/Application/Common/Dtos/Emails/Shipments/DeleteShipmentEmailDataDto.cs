using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.Emails.Shipments;

public sealed class DeleteShipmentEmailDataDto
{
    public string FirstName { get; set; } = string.Empty;

    public string ReasonForDeletion { get; set; } = string.Empty;

    public string ShipmentName { get; set; } = string.Empty;

    [JsonProperty(PropertyName = "SHIPMENT_ID", NamingStrategyType = typeof(DefaultNamingStrategy))]
    public string SHIPMENT_ID { get; set; } = string.Empty;
}
