namespace AutoLog.Domain.Entities;

public class ShippingType : BaseEntity
{
    public ShippingType()
    {

    }
    public ShippingType(ShipmentIncoterms? incoterms, ShipmentOption? shipmentOption, ShipmentType? shipmentType)
    {
        ShipmentIncoterms = incoterms;
        ShipmentOption = shipmentOption;
        ShipmentType = shipmentType;
    }
    public ShipmentType? ShipmentType { get; set; }

    public ShipmentIncoterms? ShipmentIncoterms { get; set; }

    public ShipmentOption? ShipmentOption { get; set; }

    public bool Insurance { get; set; }

    public bool Customs { get; set; }

    public List<Shipment> Shipments { get; set; } = new();
}
