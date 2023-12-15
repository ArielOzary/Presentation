namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Token provider to generate, validate token with user id
/// </summary>
public interface IUserIdTokenProvider
{
    /// <summary>
    /// Generate token for given purpose with user id
    /// </summary>
    /// <param name="purpose">Purpose of generating</param>
    /// <param name="userId">User id</param>
    /// <returns>Token with user id</returns>
    /// <exception cref="ArgumentNullException">Exception thrown if userId is null or empty</exception>
    string Generate(string purpose, string userId);

    /// <summary>
    /// Method to validate given token by purpose
    /// </summary>
    /// <param name="purpose">Purpose token was generated with</param>
    /// <param name="token">Token</param>
    /// <returns>True in case of success validation</returns>
    bool Validate(string purpose, string token);

    /// <summary>
    /// Method to get user id from token
    /// </summary>
    /// <param name="token">Token</param>
    /// <returns>User id</returns>
    string GetUserIdFromToken(string token);
}
