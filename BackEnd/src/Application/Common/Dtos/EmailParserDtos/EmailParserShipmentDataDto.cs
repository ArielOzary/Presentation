using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.EmailParserDtos;

public class EmailParserShipmentDataDto
{
    public string ShipmentNumber { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public ShipmentIncoterms? Incoterms { get; set; }

    public ShipmentOption? ShipmentOption { get; set; }

    public ShipmentType? ShipmentType { get; set; }

    public string SuppliersName { get; set; } = string.Empty;

    public string ConsigneeName { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty; // Shipment Status Stage

    public string StatusUpdateDate { get; set; } = string.Empty;

    public string BookingDetails { get; set; } = string.Empty;

    public string ContainerNumber { get; set; } = string.Empty;

    public string Remarks { get; set; } = string.Empty;

    public string VesselName { get; set; } = string.Empty;

    public string BlNumber { get; set; } = string.Empty;

    public string CustomFileNumber { get; set; } = string.Empty;

    public string ShippingLine { get; set; } = string.Empty;
}
