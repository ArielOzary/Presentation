namespace AutoLog.Domain.Entities;

public sealed class Message : IBaseAuditableEntity
{
    public string Id { get; set; }

    public string? Body { get; set; }

    public List<MessageFile> Files { get; set; } = new();

    public bool Unread { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public string ConversationId { get; set; } = string.Empty;

    public Conversation Conversation { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public Message()
    {
        Id = Guid.NewGuid().ToString();
        Unread = true;
    }
}
