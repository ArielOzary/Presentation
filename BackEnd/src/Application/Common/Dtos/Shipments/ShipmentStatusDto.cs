using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentStatusDto
{
    public int Id { get; set; }

    public string ShipmentId { get; set; } = string.Empty;

    public string Info { get; set; } = string.Empty;

    public ShipmentStatusStage Stage { get; set; }

    public int? ParentShipmentStatusId { get; set; }

    public List<ShipmentStatusDto> ChildrenShipmentStatuses { get; init; } = new();

    public DateTime Created { get; set; }
}
