using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.ShippingType;

public class ShippingTypeCreateDto
{
    public ShipmentType ShipmentType { get; set; }

    public ShipmentIncoterms ShipmentIncoterms { get; set; }

    public ShipmentOption ShipmentOption { get; set; }

    public bool Insurance { get; set; }

    public bool Customs { get; set; }
}
