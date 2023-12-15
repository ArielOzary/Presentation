using AutoLog.Application.Common.Constants;
using AutoLog.Application.IndustryTypes.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers;

[AllowAnonymous]
[Route("api/industry-type")]
[ApiController]
public sealed class IndustryTypesController : ApiControllerBase
{
    [HttpGet]
    [OutputCache(PolicyName = CachePolicies.IndustryTypes)]
    public async Task<List<IndustryTypeDto>> GetIndustryTypeList()
    {
        return await Mediator.Send(new GetIndustryTypesListQuery());
    }
}
