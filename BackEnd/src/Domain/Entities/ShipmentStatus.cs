namespace AutoLog.Domain.Entities;

public sealed class ShipmentStatus : BaseAuditableEntity
{
    public ShipmentStatusStage Stage { get; set; }

    public string StageString { get; set; } = string.Empty;

    public string? Info { get; set; }

    public int? ParentShipmentStatusId { get; set; }

    public string? ShipmentId { get; set; }

    public Shipment? Shipment { get; set; }

    public ShipmentStatus? ParentShipmentStatus { get; set; }

    public List<ShipmentStatus> ChildrenShipmentStatuses { get; set; } = new();
}
