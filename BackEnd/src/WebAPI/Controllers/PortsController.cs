using AutoLog.Application.Common.Constants;
using AutoLog.Application.Ports;
using AutoLog.Application.Ports.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers;

[AllowAnonymous]
[Route("api/ports")]
public sealed class PortsController : ApiControllerBase
{
    [HttpGet]
    [OutputCache(PolicyName = CachePolicies.Ports)]
    public async Task<List<PortDto>> GetPortsList([FromQuery] GetPortsListQuery request)
    {
        return await Mediator.Send(request);
    }

    [HttpGet("{id}")]
    public async Task<PortDto> GetPort([FromRoute]int id)
    {
        return await Mediator.Send(new GetPortQuery { Id = id });
    }
}
