using AutoLog.Application.Chats.Commands.UpdateMessage;
using AutoLog.Application.Chats.Queries.GetMessasges;
using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Application.Common.Models;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("/api/messages")]
public class MessagesController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  MESSAGE_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}")]
    public async Task<StatusCodeResult> UpdateMessageAsync([FromRoute] string id, [FromBody] UpdateMessageCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

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
    [HttpGet("{conversationId}")]
    public async Task<PaginatedList<MessageDto>> GetMessagesAsync([FromRoute] string conversationId, [FromQuery] GetMessagesQueryModel query)
    {
        var result = await Mediator.Send(new GetMessagesQuery(query, conversationId));

        return result;
    }
}
