using AutoLog.Application.Common.Utils;
using AutoLog.Domain.Common;

namespace AutoLog.Application.Common.Extensions;

public static class FileExtensions
{
    public static string GetMediaType<T>(this T attachment)
        where T : BaseAttachmentFile
    {
        return !string.IsNullOrWhiteSpace(attachment.Extension)
            ? FileExtensionUtils.GetMediaType(attachment.Extension)
            : FileExtensionUtils.GetMediaType(FileExtensionUtils.GetExtension(attachment.Name));
    }

    public static string? GetExtension<T>(this T attachment)
        where T : BaseAttachmentFile
    {
        return !string.IsNullOrWhiteSpace(attachment.Extension)
            ? attachment.Extension
            : FileExtensionUtils.GetExtension(attachment.Name);
    }
}
