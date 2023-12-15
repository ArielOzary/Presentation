using Microsoft.AspNetCore.Identity;

namespace AutoLog.Domain.Entities;
public class ApplicationUserRole : IdentityUserRole<string>
{
    public virtual ApplicationUser User { get; set; } = null!;

    public virtual ApplicationRole Role { get; set; } = null!;
}
