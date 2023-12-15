using AutoLog.Application.Common.Dtos.Shipments;

namespace AutoLog.Application.Common.Dtos.Clients;

public sealed class ExportClientDto : ClientDto
{
    public List<ShipmentListDto> Shipments { get; set; } = new();
}
