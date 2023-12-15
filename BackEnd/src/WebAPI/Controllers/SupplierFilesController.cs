using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.CompanySupplierFiles.Commands.CreateSupplierFileCommand;
using AutoLog.Application.CompanySupplierFiles.Commands.DeleteSupplierFileCommand;
using AutoLog.Application.CompanySupplierFiles.Queries.GetSupplierFileByIdQuery;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/supplier-files")]
public sealed class SupplierFilesController : ApiControllerBase
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
    public async Task<FileDto> GetSupplierFileById([FromRoute] string id)
    {
        return await Mediator.Send(new GetSupplierFileByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FILE_NOT_FOUND, HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    public async Task<StatusCodeResult> DeleteSupplierFileById([FromRoute] string id)
    {
        await Mediator.Send(new DeleteCompanySupplierFileCommand { Id = id });

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SUPPLIER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPost]
    public async Task<StatusCodeResult> AddSupplierFiles([FromForm] CreateSupplierFileCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }
}
