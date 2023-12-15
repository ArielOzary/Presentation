using AutoLog.IdentityApi.DTOs;
using AutoLog.IdentityApi.Exceptions;
using AutoLog.IdentityApi.Requests;
using AutoLog.IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.IdentityApi.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public sealed class AuthenticationController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public AuthenticationController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_IS_DELETED AUTH_FAILED USER_NOT_VERIFIED USER_IS_DEACTIVATED FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost("login")]
    public async Task<TokenResultDto> Login(LoginRequest request)
    {
        var result = await _identityService.AuthenticateAsync(request);
        return !result.result.Succeeded
            ? throw new AuthenticationException(ErrorCodes.AUTH_FAILED)
            : result.tokenDto;
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  REFRESH_FAILED USER_IS_DELETED USER_IS_DEACTIVATED
    ///</para>
    ///</remarks>
    [HttpPost("refresh")]
    public async Task<TokenResultDto> LoginByRefreshToken()
    {
        var token = await _identityService.RefreshAccessTokenAsync();

        return token;
    }
}