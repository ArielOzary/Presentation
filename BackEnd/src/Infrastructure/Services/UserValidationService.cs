using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service to verify if user already exists
/// </summary>
public sealed class UserValidationService : IUserValidationService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserValidationService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    /// <summary>
    /// Method to check if user already exists by given email
    /// </summary>
    /// <param name="email">Email to check</param>
    /// <returns>True in case user does not exist</returns>
    public async Task<bool> IsUserAlreadyExistsAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return user is not null;
    }
}
