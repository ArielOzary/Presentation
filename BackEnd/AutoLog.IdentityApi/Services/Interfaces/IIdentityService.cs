using AutoLog.IdentityApi.DTOs;
using AutoLog.IdentityApi.Requests;

namespace AutoLog.IdentityApi.Services.Interfaces;

/// <summary>
/// Service for authorization and refreshing token
/// </summary>
public interface IIdentityService
{
    /// <summary>
    /// Method for authentication
    /// </summary>
    /// <param name="request">Request with email and password</param>
    /// <returns>Failure or success result</returns>
    /// <exception cref="AuthenticationException">Exception thrown if user was not found</exception>
    Task<(Result result, TokenResultDto tokenDto)> AuthenticateAsync(LoginRequest request);

    /// <summary>
    /// Method to refresh access token
    /// </summary>
    /// <returns>Token result with access and refresh tokens</returns>
    Task<TokenResultDto> RefreshAccessTokenAsync();
}
