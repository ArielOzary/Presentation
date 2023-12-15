using AutoLog.Application.Chats.Commands.ReadMessageCommand;
using AutoLog.Application.Chats.Commands.ReadMessagesRangeCommand;
using AutoLog.Application.Chats.Queries.GetChatById;
using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Application.Common.Interfaces;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebAPI.Hubs;

namespace WebAPI.Controllers;

[Authorize]
[Route("/api/conversations")]
public class ConversationsController : ApiControllerBase
{
    private readonly IHubContext<ChatHub, IChatHub> _chatHub;

    public ConversationsController(IHubContext<ChatHub, IChatHub> hubContext)
    {
        _chatHub = hubContext;
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  CHAT_NOT_FOUND, MESSAGE_IDS_ARE_EMPTY
    ///</para>
    ///</remarks>
    [HttpPost("{id}/read-range")]
    public async Task<IActionResult> ReadRangeAsync([FromRoute] string id, [FromBody] ReadMessagesRangeCommand request)
    {
        request.ChatId = id;
        var result = await Mediator.Send(request);

        await _chatHub.Clients.Group(request.ChatId).ReadMessages(result.MessagesIds);

        return Ok(result);
    }

    [HttpPost("{id}/read-one")]
    public async Task<StatusCodeResult> ReadAsync([FromRoute] string id)
    {
        await Mediator.Send(new ReadMessageCommand { MessageId = id });

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  CHAT_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpGet("{id}")]
    public async Task<ConversationDto?> GetChatAsync([FromRoute] string id)
    {
        var result = await Mediator.Send(new GetChatByIdQuery { ChatId = id });

        return result;
    }
}
