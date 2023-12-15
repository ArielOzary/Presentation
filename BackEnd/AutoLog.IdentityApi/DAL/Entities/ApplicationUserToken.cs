using Microsoft.AspNetCore.Identity;

namespace AutoLog.IdentityApi.DAL.Entities;

/// <summary>
/// User`s token
/// </summary>
public class ApplicationUserToken : IdentityUserToken<string>
{
    public virtual ApplicationUser User { get; set; } = null!;
}
