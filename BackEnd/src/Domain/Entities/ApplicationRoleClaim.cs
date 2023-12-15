using Microsoft.AspNetCore.Identity;

namespace AutoLog.Domain.Entities;

public class ApplicationRoleClaim : IdentityRoleClaim<string>
{
    public virtual ApplicationRole Role { get; set; } = null!;
}
