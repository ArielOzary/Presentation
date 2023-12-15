namespace AutoLog.Domain.Entities;

public class QuoteFile : BaseAttachmentFile, IBaseAuditableEntity
{
    public int QuoteId { get; set; }

    public Quote Quote { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public QuoteFile(string extension, string fileId, string name, int quoteId)
    {
        Extension = extension;
        FileId = fileId;
        Name = name;
        QuoteId = quoteId;
    }

    public QuoteFile()
    {
    }
}
