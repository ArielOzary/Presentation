using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.MessageFIles.Commands.AddMessageFilesCommand;
using AutoLog.Application.MessageFIles.Commands.DeleteMessageFileCommand;
using AutoLog.Application.MessageFIles.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebAPI.Hubs;

namespace WebAPI.Controllers;

[Route("api/message-files")]
[ApiController]
public class MessageFilesController : ApiControllerBase
{
    private readonly IHubContext<ChatHub, IChatHub> _chatHub;

    public MessageFilesController(IHubContext<ChatHub, IChatHub> hubContext)
    {
        _chatHub = hubContext;
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FILE_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpGet("{id}")]
    public async Task<FileDto> GetMessageFileById([FromRoute] string id)
    {
        return await Mediator.Send(new GetMessageFileByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FILE_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    public async Task<StatusCodeResult> DeleteMessageFileById([FromRoute] string id)
    {
        await Mediator.Send(new DeleteMessageFileCommand { Id = id });

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
    [HttpPost]
    public async Task<StatusCodeResult> AddMessageFiles([FromForm] AddMessageFilesCommand request)
    {
        var message = await Mediator.Send(request);

        await _chatHub.Clients.Group(request.ConversationId).ReceiveMessage(message);

        return Ok();
    }
}
