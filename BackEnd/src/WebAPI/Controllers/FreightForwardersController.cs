using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Models;
using AutoLog.Application.FreightForwarders.Commands.DeleteOwnProfile;
using AutoLog.Application.FreightForwarders.Commands.SetOwnFFContacts;
using AutoLog.Application.FreightForwarders.Commands.UpdateFFBasicInfo;
using AutoLog.Application.FreightForwarders.Commands.UpdateFFContacts;
using AutoLog.Application.FreightForwarders.Commands.UpdateFFLocation;
using AutoLog.Application.FreightForwarders.Commands.UpdateOwnFFBasicInfo;
using AutoLog.Application.FreightForwarders.Commands.UpdateOwnFFLocation;
using AutoLog.Application.FreightForwarders.Queries.GetFFBasicInfoById;
using AutoLog.Application.FreightForwarders.Queries.GetFFContactsById;
using AutoLog.Application.FreightForwarders.Queries.GetFFLocationById;
using AutoLog.Application.FreightForwarders.Queries.GetFreightForwarders;
using AutoLog.Application.FreightForwarders.Queries.GetFreightForwardersPaging;
using AutoLog.Application.FreightForwarders.Queries.GetOwnFFBasicInfo;
using AutoLog.Application.FreightForwarders.Queries.GetOwnFFContacts;
using AutoLog.Application.FreightForwarders.Queries.GetOwnFFLocation;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/freight-forwarders")]
public sealed class FreightForwardersController : ApiControllerBase
{
    [HttpGet]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<PaginatedList<FreightForwarderDto>> GetFreightForwarders([FromQuery] GetFreightForwarderPagingQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("{id}/profile/basic-info")]
    public async Task<FreightForwarderBasicInfoDto?> GetFreightForwarderBasicInfo([FromRoute] string id)
    {
        return await Mediator.Send(new GetFreightForwarderBasicInfoByIdQuery() { Id = id });
    }

    [HttpGet("{id}/profile/contacts")]
    public async Task<FreightForwarderContactsDto?> GetFreightForwarderContacts([FromRoute] string id)
    {
        return await Mediator.Send(new GetFreightForwarderContactsByIdQuery() { Id = id });
    }

    [HttpGet("{id}/profile/location")]
    public async Task<FreightForwarderLocationDto?> GetFreightForwarderLocation([FromRoute] string id)
    {
        return await Mediator.Send(new GetFreightForwarderLocationByIdQuery() { Id = id });
    }

    [HttpGet("own-profile/basic-info")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<FreightForwarderBasicInfoDto?> GetOwnFreightForwarderBasicInfo()
    {
        return await Mediator.Send(new GetOwnFreightForwarderBasicInfoQuery());
    }

    [HttpGet("own-profile/contacts")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<FreightForwarderContactsDto?> GetOwnFreightForwarderContacts()
    {
        return await Mediator.Send(new GetOwnFreightForwarderContactsQuery());
    }

    [HttpGet("own-profile/location")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<FreightForwarderLocationDto?> GetOwnFreightForwarderLocation()
    {
        return await Mediator.Send(new GetOwnFreightForwarderLocationQuery());
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}/profile/basic-info")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> UpdateFreightForwarderBasicInfo([FromRoute] string id, [FromBody] UpdateFreightForwarderBasicInfoCommand command)
    {
        command.UserId = id;
        await Mediator.Send(command);
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}/profile/contacts")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> SetFreightForwarderContacts([FromRoute] string id, [FromBody] SetFreightForwarderContactsCommand command)
    {
        command.UserId = id;
        await Mediator.Send(command);
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}/profile/location")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> UpdateFreightForwarderLocation([FromRoute] string id, [FromBody] UpdateFreightForwarderLocationCommand command)
    {
        command.UserId = id;
        await Mediator.Send(command);
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("own-profile/basic-info")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<StatusCodeResult> UpdateOwnFreightForwarderBasicInfo([FromBody] UpdateOwnFreightForwarderBasicInfoCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>    
    [HttpPut("own-profile/contacts")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<StatusCodeResult> SetOwnFreightForwarderContacts([FromBody] SetOwnFreightForwarderContactsCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("own-profile/location")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<StatusCodeResult> UpdateOwnFreightForwarderLocation([FromBody] UpdateOwnFreightForwarderLocationCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    [HttpDelete("own-profile")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<StatusCodeResult> DeleteOwnProfile()
    {
        await Mediator.Send(new DeleteOwnFreightForwarderProfile());
        return Ok();
    }
}
