using Microsoft.AspNetCore.Identity;

namespace AutoLog.Domain.Entities;

public class ApplicationUser : IdentityUser, IBaseAuditableEntity
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

    public bool IsDeleted { get; set; }

    public string Locale { get; set; } = string.Empty;

    public Company Company { get; set; } = null!;

    public ClientProfits? ClientProfits { get; set; }

    public ProviderInfo? ProviderInfo { get; set; }

    public List<Quote> Quotes { get; set; } = new();

    public List<RecentQuoteSearch> RecentQuoteSearches { get; set; } = new();

    public virtual ICollection<ApplicationUserClaim> Claims { get; set; } = null!;

    public virtual ICollection<ApplicationUserLogin> Logins { get; set; } = null!;

    public virtual ICollection<ApplicationUserToken> Tokens { get; set; } = null!;

    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; } = null!;

    public List<Shipment> Shipments { get; set; } = new();

    public List<CompanySupplier>? Suppliers { get; set; }

    public List<Message> Messages { get; set; } = new();

    public List<Conversation> Conversations { get; set; } = new();

    public ReminderEmail? ReminderEmail { get; set; }
}
