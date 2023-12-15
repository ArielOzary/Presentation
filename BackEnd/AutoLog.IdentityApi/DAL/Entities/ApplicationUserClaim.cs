using Microsoft.AspNetCore.Identity;

namespace AutoLog.IdentityApi.DAL.Entities;

/// <summary>
/// User`s claim
/// </summary>
public class ApplicationUserClaim : IdentityUserClaim<string>
{
    public virtual ApplicationUser User { get; set; } = null!;
}
