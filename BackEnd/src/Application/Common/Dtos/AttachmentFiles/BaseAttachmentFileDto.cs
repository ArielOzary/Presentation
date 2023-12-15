namespace AutoLog.Application.Common.Dtos.AttachmentFiles;

public abstract class BaseAttachmentFileDto
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Extension { get; set; } = string.Empty;

    public string MediaType { get; set; } = string.Empty;
}
