namespace AutoLog.Domain.Entities;

public class MessageFile : BaseAttachmentFile, IBaseAuditableEntity
{
    public string MessageId { get; set; } = string.Empty;

    public Message Message { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public MessageFile(string extension, string fileId, string name, string messageId)
    {
        Extension = extension;
        FileId = fileId;
        Name = name;
        MessageId = messageId;
    }

    public MessageFile()
    {
    }
}
