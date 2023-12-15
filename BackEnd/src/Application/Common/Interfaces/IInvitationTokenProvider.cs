using AutoLog.Application.Common.Security;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Token provider to generate, validate token with email
/// </summary>
public interface IInvitationTokenProvider
{
    /// <summary>
    /// Generate token for given purpose with email
    /// </summary>
    /// <param name="purpose">Purpose of generating</param>
    /// <param name="user">User</param>
    /// <returns>Token with email</returns>
    /// <exception cref="ArgumentNullException">Exception thrown if userId is null or empty</exception>
    string Generate(string purpose, UserInvitationToken user);

    /// <summary>
    /// Method to validate given token by purpose
    /// </summary>
    /// <param name="purpose">Purpose token was generated with</param>
    /// <param name="role">User role</param>
    /// <param name="token">Token</param>
    /// <returns>True in case of success validation</returns>
    bool Validate(string purpose, string role, string token);

    /// <summary>
    /// Method to get email from token
    /// </summary>
    /// <param name="token">Token</param>
    /// <returns>Email</returns>
    string GetEmailFromToken(string token);
}
