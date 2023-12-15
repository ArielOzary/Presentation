using Microsoft.AspNetCore.Identity;

namespace AutoLog.Domain.Entities;

public class ApplicationUserLogin : IdentityUserLogin<string>
{
    public virtual ApplicationUser User { get; set; } = null!;
}
