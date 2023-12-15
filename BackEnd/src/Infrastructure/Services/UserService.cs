using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service to get information about given user
/// </summary>
public sealed class UserService : IUserService
{
    private const string DefaultName = "User";

    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    /// <summary>
    /// Method which gives contact name of give user
    /// </summary>
    /// <param name="user">User</param>
    /// <returns>Contact name of the user</returns>
    public async Task<string> GetContactNameAsync(ApplicationUser user)
    {
        var contacts = await _userManager.Users
            .Include(x => x.Company)
                .ThenInclude(x => x.Contacts)
            .Where(x => x.Id == user.Id)
            .Select(x => x.Company.Contacts)
            .FirstOrDefaultAsync();

        if (contacts is null)
            return DefaultName;

        if (await _userManager.IsInRoleAsync(user, Roles.Client) && contacts.Any())
        {
            return contacts.Where(x => x.ContactType == Domain.Enums.CompanyContactType.Basic).FirstOrDefault()?.Name ?? DefaultName;
        }
        if (await _userManager.IsInRoleAsync(user, Roles.FreightForwarder) && contacts.Any())
        {
            return contacts.Where(x => x.ContactType == Domain.Enums.CompanyContactType.Payment).FirstOrDefault()?.Name ?? DefaultName;
        }

        return DefaultName;
    }
}
