namespace AutoLog.Domain.Entities;

public sealed class Shipment : BaseGuidIdEntity, IBaseAuditableEntity
{
    public int? ShippingTypeId { get; set; }

    public ShippingType? ShippingType { get; set; }

    public int? CompanyId { get; set; } // freight forwarder id

    public Company? Company { get; set; }

    public int? QuoteId { get; set; }

    public Quote? Quote { get; set; }

    public int? RateId { get; set; }

    public Rate? Rate { get; set; }

    public List<ShipmentStatus> ShipmentStatuses { get; set; } = new();

    public string? UserId { get; set; }

    public ApplicationUser? User { get; set; }

    public Conversation Conversation { get; set; } = null!;

    public string? ContainerNumberOrVesselName { get; set; }

    public List<ShipmentFile> ShipmentFiles { get; set; } = new();

    public ReminderStatus ReminderStatus { get; set; }

    public OpenStatusStage OpenStatusStage { get; set; }

    public OpenStatusStage? PreviousStatusStage { get; set; }

    public DateTime ETA { get; set; }

    public DateTime ETD { get; set; }

    public double ShipmentTotalProfit { get; set; }

    public bool IsError { get; set; } = false;

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }
}
