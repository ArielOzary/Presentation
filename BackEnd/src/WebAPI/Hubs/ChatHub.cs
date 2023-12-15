using AutoLog.Application.Chats.Commands.AddMessageCommand;
using AutoLog.Application.Chats.Commands.AddUserToChatCommand;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WebAPI.Hubs;

/// <summary>
/// SignalR hub for chat
/// </summary>
[Authorize]
public sealed class ChatHub : Hub<IChatHub>
{
    private readonly ISender _mediator;

    public ChatHub(ISender mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Method to join chat room by chat id
    /// </summary>
    /// <param name="chatId">Chat id</param>
    /// <returns>Task</returns>
    public async Task JoinChatRoom(string chatId)
    {
        await _mediator.Send(new AddUserToChatCommand { ChatId = chatId });

        await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
    }

    /// <summary>
    /// Method to leave char room by chat id
    /// </summary>
    /// <param name="chatId">Chat id</param>
    /// <returns>Task</returns>
    public async Task LeaveChatRoom(string chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
    }

    /// <summary>
    /// Method to send message to chat
    /// </summary>
    /// <param name="request">Request body with chat id and message</param>
    /// <returns>Task</returns>
    public async Task SendMessage(AddMessageCommand request)
    {
        var message = await _mediator.Send(request);

        await Clients.Group(request.ChatId).ReceiveMessage(message);
    }
}
