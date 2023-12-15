using Microsoft.AspNetCore.Identity;

namespace AutoLog.IdentityApi.DAL.Entities;

/// <summary>
/// User`s role
/// </summary>
public class ApplicationRole : IdentityRole
{
    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; } = null!;

    public virtual ICollection<ApplicationRoleClaim> RoleClaims { get; set; } = null!;
}
