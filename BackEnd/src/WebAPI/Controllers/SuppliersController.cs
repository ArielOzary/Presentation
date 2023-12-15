using AutoLog.Application.Common.Dtos.CompanySuppliers;
using AutoLog.Application.Common.Dtos.Suppliers;
using AutoLog.Application.Common.Models;
using AutoLog.Application.CompanySuppliers.Commands.CreateSupplier;
using AutoLog.Application.CompanySuppliers.Commands.DeleteSupplierCommand;
using AutoLog.Application.CompanySuppliers.Commands.UpdateSupplierCommand;
using AutoLog.Application.CompanySuppliers.Queries.GetOwnSuppliersQuery;
using AutoLog.Application.CompanySuppliers.Queries.GetSupplierByIdQuery;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/suppliers")]
public sealed class SuppliersController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost]
    public async Task<int> CreateSupplier([FromBody] CreateCompanySupplierCommand command)
    {
        var id = await Mediator.Send(command);

        return id;
    }

    [HttpGet]
    public async Task<PaginatedList<CompanySupplierDto>> GetSuppliers([FromQuery] GetOwnCompanySuppliersQuery query)
    {
        return await Mediator.Send(query);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SUPPLIER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpGet("{id}")]
    public async Task<CompanySupplierDetailDto?> GetSupplier([FromRoute] int id)
    {
        return await Mediator.Send(new GetCompanySupplierByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SUPPLIER_NOT_FOUND, HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    public async Task<StatusCodeResult> DeleteSupplier([FromRoute] int id)
    {
        await Mediator.Send(new DeleteCompanySupplierCommand { Id = id });

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SUPPLIER_NOT_FOUND, HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpPut("{id}")]
    public async Task<StatusCodeResult> UpdateSupplier([FromRoute] int id, [FromBody] UpdateCompanySupplierCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

        return Ok();
    }
}
