using AutoLog.IdentityApi.Enums;
using Microsoft.AspNetCore.Identity;

namespace AutoLog.IdentityApi.DAL.Entities;

/// <summary>
/// User
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public bool IsDeactivated { get; set; }

    public UserVerificationStatus Status { get; set; }

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public string? DeactivationReason { get; set; }

    public Company Company { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public string Locale { get; set; } = string.Empty;

    public virtual ICollection<ApplicationUserClaim> Claims { get; set; } = null!;

    public virtual ICollection<ApplicationUserLogin> Logins { get; set; } = null!;

    public virtual ICollection<ApplicationUserToken> Tokens { get; set; } = null!;

    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; } = null!;
}
