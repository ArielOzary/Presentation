namespace AutoLog.Domain.Entities;

public sealed class ShipmentFile : BaseAttachmentFile, IBaseAuditableEntity
{
    public string ShipmentId { get; set; } = string.Empty;

    public Shipment Shipment { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public ShipmentFile(string extension, string fileId, string name, string shipmentId)
    {
        Extension = extension;
        FileId = fileId;
        Name = name;
        ShipmentId = shipmentId;
    }

    public ShipmentFile()
    {
    }
}
