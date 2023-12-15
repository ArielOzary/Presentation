using AutoLog.Application.Common.Constants;
using AutoLog.Application.Reminders.Commands.RemindClient;
using AutoLog.Application.Reminders.Commands.RemindForwarder;
using AutoLog.Application.Reminders.Commands.SetReminderStatus;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/remind")]
public sealed class ReminderController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPost("forwarder-to-client")]
    [Authorize(Policy = Policies.FreightForwarderOrAdminRights)]
    public async Task<StatusCodeResult> RemindClient([FromBody] RemindClientStatusCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND SHIPMENT_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPost("client-to-forwarder")]
    public async Task<StatusCodeResult> RemindForwarder([FromBody] RemindForwarderStatusCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("set-status")]
    public async Task<StatusCodeResult> SetReminderStatus([FromBody] SetReminderStatusCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }
}
