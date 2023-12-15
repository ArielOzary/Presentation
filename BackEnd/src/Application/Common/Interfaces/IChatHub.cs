using AutoLog.Application.Common.Dtos.Chats;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// SignalR hub for chat
/// </summary>
public interface IChatHub
{
#pragma warning disable VSTHRD200 // Use "Async" suffix for async methods
    Task ReceiveMessage(MessageDto message);
    Task ReadMessages(List<string> messagesIds);
#pragma warning restore VSTHRD200 // Use "Async" suffix for async methods
}
