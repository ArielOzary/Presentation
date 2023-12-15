using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public abstract class ShipmentDto
{
    public string Id { get; set; } = string.Empty;

    public string ConversationId { get; set; } = string.Empty;

    public ReminderStatus ReminderStatus { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Company { get; set; } = string.Empty;

    public string Client { get; set; } = string.Empty;

    public string ContainerNumberOrVesselName { get; set; } = string.Empty;

    public double Profits { get; set; }

    public bool IsDelayed { get; set; }

    public DateTime ArrivalDate { get; set; }

    public string DestinationPort { get; set; } = string.Empty;

    public DateTime DepartedDate { get; set; }

    public string OriginPort { get; set; } = string.Empty;

    public int ShippingTypeId { get; set; }

    public int CompanyId { get; set; }

    public int QuoteId { get; set; }

    public int RateId { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string FreightForwarderId { get; set; } = string.Empty;

    public int UnreadMessagesAmount { get; set; }

    public bool Unread { get; set; }

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }
}
