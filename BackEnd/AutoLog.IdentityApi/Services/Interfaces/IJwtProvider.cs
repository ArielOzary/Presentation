using AutoLog.IdentityApi.DAL.Entities;
using AutoLog.IdentityApi.DTOs;

namespace AutoLog.IdentityApi.Services.Interfaces;

/// <summary>
/// Provider for generating tokens and validating them
/// </summary>
public interface IJwtProvider
{
    /// <summary>
    /// Generate authorization token and refresh tokens for user
    /// </summary>
    /// <param name="user">User who want to authorize</param>
    /// <returns>Auth token and refresh token as result</returns>
    Task<TokenResultDto> GenerateAsync(ApplicationUser user);

    /// <summary>
    /// Method to refresh access token from coockies
    /// </summary>
    /// <returns>Auth token and refresh token as result</returns>
    /// <exception cref="AuthenticationException">Exception thrown if user was not found or token is invalid</exception>
    /// <exception cref="ActivationException">Exception thrown if user is deleted or deactivated</exception>
    Task<TokenResultDto> RefreshAccessTokenAsync();
}
