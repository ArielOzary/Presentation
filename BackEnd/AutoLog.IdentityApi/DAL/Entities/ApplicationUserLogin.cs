using Microsoft.AspNetCore.Identity;

namespace AutoLog.IdentityApi.DAL.Entities;

/// <summary>
/// User`s login
/// </summary>
public class ApplicationUserLogin : IdentityUserLogin<string>
{
    public virtual ApplicationUser User { get; set; } = null!;
}
