using Microsoft.AspNetCore.Identity;

namespace AutoLog.Domain.Entities;

public class ApplicationRole : IdentityRole
{
    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; } = null!;

    public virtual ICollection<ApplicationRoleClaim> RoleClaims { get; set; } = null!;
}
