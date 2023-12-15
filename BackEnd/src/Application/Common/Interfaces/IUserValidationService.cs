namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to verify if user already exists
/// </summary>
public interface IUserValidationService
{
    /// <summary>
    /// Method to check if user already exists by given email
    /// </summary>
    /// <param name="email">Email to check</param>
    /// <returns>True in case user does not exist</returns>
    Task<bool> IsUserAlreadyExistsAsync(string email);
}
