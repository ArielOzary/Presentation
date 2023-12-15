using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.ApplicationUser;
using AutoLog.Application.Users.Commands.ChangePassword;
using AutoLog.Application.Users.Commands.DeleteUser;
using AutoLog.Application.Users.Commands.HardDeleteUser;
using AutoLog.Application.Users.Commands.SetActivationStatus;
using AutoLog.Application.Users.Commands.SetOwnLocale;
using AutoLog.Application.Users.Queries;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/users")]
public sealed class UsersController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}/verification-status")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> SetVerificationStatus([FromRoute] string id, [FromBody] SetUserVerificationStatusCommand command)
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
    [HttpPut("{id}/activation-status")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> SetActivationStatus([FromRoute] string id, [FromBody] SetUserActivationStatusCommand command)
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
    [HttpPut("change-password")]
    public async Task<StatusCodeResult> ChangePassword([FromBody] ChangeUserPasswordCommand command)
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
    [HttpGet("me")]
    public async Task<UserDto> GetOwnUserDto()
    {
        return await Mediator.Send(new GetOwnUserDtoQuery());
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpGet("{id}")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<UserDto> GetUserDto([FromRoute] string id)
    {
        return await Mediator.Send(new GetUserDtoByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> RemoveUser([FromRoute] string id, [FromBody] DeleteUserCommand command)
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
    [HttpDelete("{id}/hard")]
    [ApiExplorerSettings(IgnoreApi = true)]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> HardRemoveUser([FromRoute] string id)
    {
        await Mediator.Send(new HardDeleteUserCommand { UserId = id });

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND, UNSUPPORTED_LOCALE, FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPut("locale")]
    public async Task<StatusCodeResult> SetLocale([FromBody] SetOwnLocaleCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }
}
