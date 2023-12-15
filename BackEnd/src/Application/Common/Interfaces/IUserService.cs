using AutoLog.Domain.Entities;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to get information about given user
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Method which gives contact name of give user
    /// </summary>
    /// <param name="user">User</param>
    /// <returns>Contact name of the user</returns>
    Task<string> GetContactNameAsync(ApplicationUser user);
}
