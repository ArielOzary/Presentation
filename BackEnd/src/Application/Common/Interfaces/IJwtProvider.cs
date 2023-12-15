using AutoLog.Application.Common.Dtos;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Jwt provider for logic with tokens
/// </summary>
public interface IJwtProvider
{
    /// <summary>
    /// Method to generate token
    /// </summary>
    /// <param name="user">User for who token will be generated</param>
    /// <returns>Generated access and refresh tokens</returns>
    Task<TokenResultDto> GenerateAsync(ApplicationUser user);

    /// <summary>
    /// Generate token for serilog ui
    /// </summary>
    /// <returns>Token for serilog ui</returns>
    Task<string> GenerateLogsTokenAsync();

    /// <summary>
    /// Method to validate logs token
    /// </summary>
    /// <param name="logsToken">Token for serilog ui</param>
    /// <returns>True in case of success validation</returns>
    /// <exception cref="AuthenticationException">Exception thrown in case of null or empty token</exception>
    bool ValidateLogsToken(string? logsToken);

    /// <summary>
    /// Method to receive user id from token
    /// </summary>
    /// <param name="token">Token</param>
    /// <returns>User id</returns>
    string GetIdFromToken(string? token);
}
