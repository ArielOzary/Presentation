using AutoLog.Application.Common.Dtos.AttachmentFiles;

namespace AutoLog.Application.Common.Dtos.Chats;

public sealed class MessageDto
{
    public string Id { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;

    public bool Unread { get; set; }

    public string UserId { get; set; } = string.Empty;

    public DateTime Created { get; set; }

    public List<MessageFileDto> Files { get; set; } = new();
}
