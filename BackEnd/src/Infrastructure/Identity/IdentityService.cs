using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Models;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Identity;

/// <summary>
/// Service to work with user`s identity state
/// </summary>
public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(
        UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    /// <summary>
    /// Method to gate user name by user id
    /// </summary>
    /// <param name="userId">User`s id</param>
    /// <returns>Username</returns>
    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

        return user?.UserName;
    }

    /// <summary>
    /// Method to create user 
    /// </summary>
    /// <param name="userEmail">User`s email</param>
    /// <param name="password">User`s password</param>
    /// <returns>User`s id and result status</returns>
    /// <exception cref="AutoLogException">Exception thrown if user was not found</exception>
    public async Task<(Result Result, string UserId)> CreateUserAsync(string userEmail, string password)
    {
        var user = await _userManager.FindByEmailAsync(userEmail);

        if (user is not null)
            throw new AutoLogException(ErrorCodes.USER_ALREADY_EXISTING);

        user = new ApplicationUser
        {
            Email = userEmail,
            UserName = userEmail,
        };

        var result = await _userManager.CreateAsync(user, password);

        return (result.ToApplicationResult(), user.Id);
    }

    /// <summary>
    /// Method to create user 
    /// </summary>
    /// <param name="applicationUser">User</param>
    /// <returns>Result status</returns>
    /// <exception cref="ActivationException">Exception thrown if user was not found or is deleted</exception>
    /// <exception cref="AutoLogException">Exception thrown if user was not found</exception>
    public async Task<Result> CreateUserAsync(ApplicationUser applicationUser)
    {
        var user = await _userManager.Users.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Email == applicationUser.Email);

        if (user is not null && user.Status == UserVerificationStatus.Rejected)
        {
            await _userManager.DeleteAsync(user);
        }
        else if (user is not null && user.IsDeleted)
        {
            throw new ActivationException(ErrorCodes.USER_IS_DELETED, ErrorCodes.USER_IS_DELETED, user.DeactivationReason);
        }
        else if (user is not null)
        {
            throw new AutoLogException(ErrorCodes.USER_ALREADY_EXISTING);
        }

        var result = await _userManager.CreateAsync(applicationUser);

        return result.ToApplicationResult();
    }

    /// <summary>
    /// Method to check is user is in role
    /// </summary>
    /// <param name="userId">User`s id to check</param>
    /// <param name="role">Role to check</param>
    /// <returns>True in case if user is in role</returns>
    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        return user is not null && await _userManager.IsInRoleAsync(user, role);
    }

    /// <summary>
    /// Method to delete user by id
    /// </summary>
    /// <param name="userId">User`s id</param>
    /// <returns>Result of opperation</returns>
    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        return user is not null ? await DeleteUserAsync(user) : Result.Success();
    }

    /// <summary>
    /// Method to delete user
    /// </summary>
    /// <param name="user">User to delete</param>
    /// <returns>Result of opperation</returns>
    private async Task<Result> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.ToApplicationResult();
    }

    /// <summary>
    /// Method to add role to user
    /// </summary>
    /// <param name="user">User to add role</param>
    /// <param name="roleName">Role to add</param>
    /// <returns>Result of opperation</returns>
    public async Task<Result> AddRoleAsync(ApplicationUser user, string roleName)
    {
        var result = await _userManager.AddToRoleAsync(user, roleName);

        return result.ToApplicationResult();
    }
}
