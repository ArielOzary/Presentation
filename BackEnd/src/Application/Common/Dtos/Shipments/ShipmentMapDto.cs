using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Shipments;

public sealed class ShipmentMapDto
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public bool IsDelayed { get; set; }

    public string DestinationCountry { get; set; } = string.Empty;

    public double DestinationLatitude { get; set; }

    public double DestinationLongitude { get; set; }

    public string OriginCountry { get; set; } = string.Empty;

    public double OriginLatitude { get; set; }

    public double OriginLongitude { get; set; }

    public ShipmentStatusStage ShipmentStatusStage { get; set; }

    public ShipmentOption ShipmentOption { get; set; }
}
