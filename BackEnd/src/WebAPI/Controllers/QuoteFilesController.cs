using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.QuoteFiles.Commands.AddQuoteFilesCommand;
using AutoLog.Application.QuoteFiles.Commands.DeleteQuoteFileCommand;
using AutoLog.Application.QuoteFiles.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/quote-files")]
[ApiController]
public sealed class QuoteFilesController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FILE_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpGet("{id}")]
    public async Task<FileDto> GetQuoteFileById([FromRoute] string id)
    {
        return await Mediator.Send(new GetQuoteFileByIdQuery { Id = id });
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
    public async Task<StatusCodeResult> DeleteQuoteFileById([FromRoute] string id)
    {
        await Mediator.Send(new DeleteQuoteFileCommand { Id = id });
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  QUOTE_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPost]
    public async Task<StatusCodeResult> AddQuoteFile([FromForm] AddQuoteFilesCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }
}
