using AutoLog.Application.Common.Models;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to work with user`s identity state
/// </summary>
public interface IIdentityService
{
    /// <summary>
    /// Method to gate user name by user id
    /// </summary>
    /// <param name="userId">User`s id</param>
    /// <returns>Username</returns>
    Task<string?> GetUserNameAsync(string userId);

    /// <summary>
    /// Method to check is user is in role
    /// </summary>
    /// <param name="userId">User`s id to check</param>
    /// <param name="role">Role to check</param>
    /// <returns>True in case if user is in role</returns>
    Task<bool> IsInRoleAsync(string userId, string role);

    /// <summary>
    /// Method to create user 
    /// </summary>
    /// <param name="userEmail">User`s email</param>
    /// <param name="password">User`s password</param>
    /// <returns>User`s id and result status</returns>
    /// <exception cref="AutoLogException">Exception thrown if user was not found</exception>
    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    /// <summary>
    /// Method to delete user by id
    /// </summary>
    /// <param name="userId">User`s id</param>
    /// <returns>Result of opperation</returns>
    Task<Result> DeleteUserAsync(string userId);

    /// <summary>
    /// Method to create user 
    /// </summary>
    /// <param name="applicationUser">User</param>
    /// <returns>Result status</returns>
    /// <exception cref="ActivationException">Exception thrown if user was not found or is deleted</exception>
    /// <exception cref="AutoLogException">Exception thrown if user was not found</exception>
    Task<Result> CreateUserAsync(ApplicationUser applicationUser);

    /// <summary>
    /// Method to add role to user
    /// </summary>
    /// <param name="user">User to add role</param>
    /// <param name="roleName">Role to add</param>
    /// <returns>Result of opperation</returns>
    Task<Result> AddRoleAsync(ApplicationUser user, string roleName);
}
