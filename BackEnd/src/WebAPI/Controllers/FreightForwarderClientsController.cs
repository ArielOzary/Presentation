using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Clients;
using AutoLog.Application.Common.Models;
using AutoLog.Application.FreightForwarders.Queries.GetFFClients;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/freight-forwarders")]
[Authorize(Policy = Policies.FreightForwarderRights)]
public sealed class FreightForwarderClientsController : ApiControllerBase
{
    [HttpGet("own-clients")]
    public async Task<PaginatedList<ClientDto>> GetClients([FromQuery] GetFFClientsPagingQuery query)
    {
        return await Mediator.Send(query);
    }
}
