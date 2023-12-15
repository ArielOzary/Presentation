namespace AutoLog.Application.Common.Dtos.Emails.Shipments;

public sealed class DeleteShipmentEmailDto : BaseEmailDto
{
    public string ClientName { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;

    public string ShipmentName { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;
}
