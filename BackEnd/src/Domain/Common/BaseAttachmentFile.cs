namespace AutoLog.Domain.Common;

public class BaseAttachmentFile : BaseGuidIdEntity
{
    public string Name { get; set; } = string.Empty;

    public string Extension { get; set; } = string.Empty;

    public string FileId { get; set; } = string.Empty;
}
