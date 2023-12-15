using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;
using AutoLog.Application.Geo.Queries.GetConatinerFullInfo;
using AutoLog.Application.Geo.Queries.GetContainerShortInfo;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/track")]
public sealed class TrackingController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  TRACKING_API_ERROR, EMPTY_RESPONSE, FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpGet("container")]
    [OutputCache(PolicyName = CachePolicies.ContainersFull)]
    public async Task<ShipmentTrackingRoot> GetContainer([FromQuery] GetContainerFullInfoQuery requesst)
    {
        return await Mediator.Send(requesst);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  TRACKING_API_ERROR, EMPTY_RESPONSE, FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpGet("container/short")]
    [OutputCache(PolicyName = CachePolicies.ContainersShort)]
    public async Task<TrackingRouteData> GetContainerShort([FromQuery] GetContainerShortInfoQuery requesst)
    {
        return await Mediator.Send(requesst);
    }
}
