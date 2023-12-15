namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Token provider for confirmation of password reset
/// </summary>
/// <typeparam name="TUser">Generic user</typeparam>
public interface IAutoLogResetPasswordConfirmationTokenProvider
{
    /// <summary>
    /// Method to get user id from authorization token 
    /// </summary>
    /// <param name="token">Auth token</param>
    /// <returns>User id</returns>
    string GetUserIdFromToken(string token);

    public string Name { get; }
}
