using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentDetailDto : ShipmentDto
{
    public ShipmentStatusDto? ShipmentStatus { get; set; }

    public List<ContainerType> ContainerTypes { get; set; } = new();

    public string Containers { get; set; } = string.Empty;

    public int Units { get; set; }

    public double TotalWeight { get; set; }

    public double CBM { get; set; }

    public List<ShipmentFileDto> MyFiles { get; set; } = new();

    public List<ShipmentFileDto> OtherFiles { get; set; } = new();
}
