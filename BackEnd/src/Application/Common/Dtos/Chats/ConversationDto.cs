namespace AutoLog.Application.Common.Dtos.Chats;

public sealed class ConversationDto
{
    public string Id { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public List<string> UserIds { get; set; } = new();

    public List<MessageDto> Messages { get; set; } = new();

    public DateTime Created { get; set; }
}
