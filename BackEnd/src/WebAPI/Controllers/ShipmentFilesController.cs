using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.ShipmentFiles.Commands.AddShipmentFilesCommand;
using AutoLog.Application.ShipmentFiles.Commands.DeleteShipmentFileCommand;
using AutoLog.Application.ShipmentFiles.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/shipment-files")]
[ApiController]
public sealed class ShipmentFilesController : ApiControllerBase
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
    public async Task<FileDto> GetShipmentFileById([FromRoute] string id)
    {
        return await Mediator.Send(new GetShipmentFileByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FILE_NOT_FOUND HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    public async Task<StatusCodeResult> DeleteShipmentFileById([FromRoute] string id)
    {
        await Mediator.Send(new DeleteShipmentFileCommand { Id = id });

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPost]
    public async Task<StatusCodeResult> AddShipmentFile([FromForm] AddShipmentFilesCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }
}
