namespace AutoLog.Domain.Entities;

public sealed class Conversation : IBaseAuditableEntity
{
    public string Id { get; set; }

    public string ShipmentId { get; set; } = string.Empty;

    public Shipment Shipment { get; set; } = null!;

    public List<ApplicationUser> Users { get; set; } = new();

    public List<Message> Messages { get; set; } = new();

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public Conversation()
    {
        Id = Guid.NewGuid().ToString();
    }
}
