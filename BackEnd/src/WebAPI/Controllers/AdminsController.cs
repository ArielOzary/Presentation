using AutoLog.Application.Admins.Queries.GetAdminById;
using AutoLog.Application.Admins.Queries.GetAdmins;
using AutoLog.Application.Admins.Queries.GetSerilogLink;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Models;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/admins")]
[Authorize(Policy = Policies.AdminRights)]
public sealed class AdminsController : ApiControllerBase
{
    [HttpGet]
    public async Task<PaginatedList<AdminDto>> GetAdminsPaginatedList([FromQuery] GetAdminsWithPagingQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("{id}")]
    public async Task<AdminDto?> GetAdminById([FromRoute] string id)
    {
        return await Mediator.Send(new GetAdminByIdQuery { Id = id });
    }

    [HttpGet("serilog")]
    public async Task<IActionResult> GetLogsToken()
    {
        var link = await Mediator.Send(new GetSerilogLinkQuery
        {
            Scheme = Request.Scheme,
            Host = Request.Host.Value
        });

        return Ok(new { Link = link });
    }
}
