using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentTOSFilterDto
{
    public List<ShipmentType>? ShipmentTypes { get; set; }

    public List<ShipmentOption>? ShipmentOptions { get; set; }

    public List<ShipmentStatusStage>? ShipmentStatuses { get; set; }
}
