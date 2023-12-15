using AutoLog.IdentityApi.DAL.Entities;
using AutoLog.IdentityApi.DTOs;
using AutoLog.IdentityApi.Enums;
using AutoLog.IdentityApi.Exceptions;
using AutoLog.IdentityApi.Requests;
using AutoLog.IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.IdentityApi.Services;

/// <summary>
/// Service for authorization and refreshing token
/// </summary>
public sealed class IdentityService : IIdentityService
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtProvider _jwtProvider;
    private readonly IUserIdTokenProvider _userIdTokenProvider;

    public IdentityService(
        IJwtProvider jwtProvider,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IUserIdTokenProvider userIdTokenProvider)
    {
        _jwtProvider = jwtProvider;
        _userManager = userManager;
        _signInManager = signInManager;
        _userIdTokenProvider = userIdTokenProvider;
    }

    /// <summary>
    /// Method for authentication
    /// </summary>
    /// <param name="request">Request with email and password</param>
    /// <returns>Failure or success result</returns>
    /// <exception cref="AuthenticationException">Exception thrown if user was not found</exception>
    public async Task<(Result, TokenResultDto)> AuthenticateAsync(LoginRequest request)
    {
        var tokenResultDto = new TokenResultDto();
        Result? result = null;

        var user = await _userManager.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Email == request.Email)
            ?? throw new AuthenticationException(ErrorCodes.AUTH_FAILED);

        ValidateUser(user);

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, true);
        if (signInResult.Succeeded)
        {
            tokenResultDto = await _jwtProvider.GenerateAsync(user);
            result = Result.Success();
        }
        else
        {
            result = Result.Failure(new List<IdentityError> { });
        }

        return (result, tokenResultDto);
    }

    /// <summary>
    /// Method to validate user
    /// </summary>
    /// <param name="user">User which should be validated</param>
    /// <exception cref="VerificationException">Exception thrown if user is not verified</exception>
    /// <exception cref="ActivationException">Exception thrown if user is not activated or deleted</exception>
    private void ValidateUser(ApplicationUser user)
    {
        if (user.Status != UserVerificationStatus.Verified)
        {
            var token = _userIdTokenProvider.Generate(TokenPurposes.VERIFICATION_STATUS, user.Id);
            throw new VerificationException(ErrorCodes.USER_NOT_VERIFIED, token);
        }

        if (user.IsDeactivated)
            throw new ActivationException(ErrorCodes.USER_IS_DEACTIVATED, user.DeactivationReason);

        if (user.IsDeleted)
            throw new ActivationException(ErrorCodes.USER_IS_DELETED, user.DeactivationReason);
    }

    /// <summary>
    /// Method to refresh access token
    /// </summary>
    /// <returns>Token result with access and refresh tokens</returns>
    public async Task<TokenResultDto> RefreshAccessTokenAsync()
    {
        return await _jwtProvider.RefreshAccessTokenAsync();
    }
}
