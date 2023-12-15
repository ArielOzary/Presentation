using AutoLog.Application.Common.Dtos;
using AutoLog.Application.ResetPassword.Commands;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[AllowAnonymous]
[Route("api/password")]
public sealed class ResetPasswordController : ApiControllerBase
{
    [HttpPost("recovery")]
    public async Task<StatusCodeResult> RecoveryPassword([FromBody] RecoveryPasswordCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND CONFIRMATION_FAILED
    ///</para>
    ///</remarks>
    [HttpPost("exchange-token")]
    public async Task<TokenResultDto> ExchangeRecoveryPasswordToken([FromBody] TemporaryLoginAccessCommand command)
    {
        return await Mediator.Send(command);
    }
}
