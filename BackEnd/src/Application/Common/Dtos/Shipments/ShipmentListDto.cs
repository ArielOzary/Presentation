using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentListDto : ShipmentDto
{
    public bool IsError { get; set; }

    public OpenStatusStage OpenStatusStage { get; set; }

    public OpenStatusStage? PreviousStatusStage { get; set; }

    public ShipmentStatusStage ShipmentStatusStage { get; set; }
}
