using AutoLog.Application.Common.Constants;
using AutoLog.Application.Geo.Queries.GetCities;
using AutoLog.Application.Geo.Queries.GetCountries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers;

[AllowAnonymous]
[Route("api/geo")]
public sealed class GeoController : ApiControllerBase
{
    [HttpGet("countries")]
    [OutputCache(PolicyName = CachePolicies.Countries)]
    public async Task<List<string>> GetCountries([FromQuery] GetCountiresQuery requesst)
    {
        return await Mediator.Send(requesst);
    }

    [HttpGet("cities")]
    [OutputCache(PolicyName = CachePolicies.Cities)]
    public async Task<List<string>> GetCities([FromQuery] GetCitiesQuery requesst)
    {
        return await Mediator.Send(requesst);
    }
}
