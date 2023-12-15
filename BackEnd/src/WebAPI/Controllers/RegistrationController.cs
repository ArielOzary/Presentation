using AutoLog.Application.Common.Dtos.Registration;
using AutoLog.Application.Registration.Commands.AdminInvitation;
using AutoLog.Application.Registration.Commands.AdminRegistration;
using AutoLog.Application.Registration.Commands.ClientRegistration;
using AutoLog.Application.Registration.Commands.FreightForwarderInvitation;
using AutoLog.Application.Registration.Commands.FreightForwarderRegistration;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[AllowAnonymous]
[Route("api/registration")]
public sealed class RegistrationController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  CONFIRMATION_FAILED, FIELD_REQUIRED,
    ///  DefaultError, ConcurrencyFailure, PasswordMismatch, 
    ///  InvalidToken, LoginAlreadyAssociated, InvalidUserName, 
    ///  InvalidEmail, DuplicateUserName, DuplicateEmail, InvalidRoleName, 
    ///  DuplicateRoleName, UserAlreadyHasPassword, UserLockoutNotEnabled, 
    ///  UserAlreadyInRole, UserNotInRole, PasswordTooShort, 
    ///  PasswordRequiresNonAlphanumeric, PasswordRequiresDigit, 
    ///  PasswordRequiresLower, PasswordRequiresUpper.
    ///</para>
    ///</remarks>
    [HttpPost("admin")]
    public async Task<IActionResult> Register([FromBody] AdminRegistrationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_IS_DELETED, FIELD_REQUIRED, PASSWORDS_NOT_MATCH, COMMENTS_LENGTH_EXCEEDED_100,
    ///  DefaultError, ConcurrencyFailure, PasswordMismatch, 
    ///  InvalidToken, LoginAlreadyAssociated, InvalidUserName, 
    ///  InvalidEmail, DuplicateUserName, DuplicateEmail, InvalidRoleName, 
    ///  DuplicateRoleName, UserAlreadyHasPassword, UserLockoutNotEnabled, 
    ///  UserAlreadyInRole, UserNotInRole, PasswordTooShort, 
    ///  PasswordRequiresNonAlphanumeric, PasswordRequiresDigit, 
    ///  PasswordRequiresLower, PasswordRequiresUpper.
    ///</para>
    ///</remarks>
    [HttpPost("client")]
    public async Task<ClientRegistrationResponseDto> ClientRegister([FromBody] ClientRegistrationCommand command)
    {
        return await Mediator.Send(command);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  CONFIRMATION_FAILED, FIELD_REQUIRED, COMMENTS_LENGTH_EXCEEDED_100,
    ///  DefaultError, ConcurrencyFailure, PasswordMismatch, 
    ///  InvalidToken, LoginAlreadyAssociated, InvalidUserName, 
    ///  InvalidEmail, DuplicateUserName, DuplicateEmail, InvalidRoleName, 
    ///  DuplicateRoleName, UserAlreadyHasPassword, UserLockoutNotEnabled, 
    ///  UserAlreadyInRole, UserNotInRole, PasswordTooShort, 
    ///  PasswordRequiresNonAlphanumeric, PasswordRequiresDigit, 
    ///  PasswordRequiresLower, PasswordRequiresUpper.
    ///</para>
    ///</remarks>
    [HttpPost("freight-forwarder")]
    public async Task<IActionResult> FreightForwarderRegister([FromBody] FreightForwarderRegistrationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_ALREADY_EXISTING
    ///</para>
    ///</remarks>
    [Authorize]
    [HttpPost("invite-admin")]
    public async Task<IActionResult> AdminInvitation([FromBody] AdminInvitationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_ALREADY_EXISTING
    ///</para>
    ///</remarks>
    [Authorize]
    [HttpPost("invite-freight-forwarder")]
    public async Task<IActionResult> FreightForwarderInvitation([FromBody] FreightForwarderInvitationCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }
}
