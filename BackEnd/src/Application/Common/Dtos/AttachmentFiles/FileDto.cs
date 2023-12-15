namespace AutoLog.Application.Common.Dtos.AttachmentFiles;

public class FileDto
{
    public string Name { get; set; } = string.Empty;

    public string Link { get; set; } = null!;

    public string Extension { get; set; } = string.Empty;

    public string MediaType { get; set; } = string.Empty;
}
