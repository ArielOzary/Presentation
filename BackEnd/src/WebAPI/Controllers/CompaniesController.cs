using AutoLog.Application.Common.Models;
using AutoLog.Application.Companies.Queries.GetFFCompanyNames;
using AutoLog.Application.Companies.Queries.GetFFDtoByCompanyId;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/companies")]
public sealed class CompaniesController : ApiControllerBase
{
    [HttpGet("freight-forwarder-names")]
    public async Task<PaginatedList<FreightForwarderCompanyNameDto>> GetFreightForwarderWithCompanyNameList([FromQuery] GetFreightForwarderWithCompanyNamePagingQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("freight-forwarder/{companyId}")]
    public async Task<FreightForwarderCompanyDto?> GetFreightForwarderDto([FromRoute] int companyId)
    {
        return await Mediator.Send(new GetFreightForwarderDtoByCompanyIdQuery { Id = companyId });
    }
}
