namespace AutoLog.Domain.Entities;

public class CompanySupplier : BaseEntity, IBaseAuditableEntity
{
    public string ContactName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string CompanyAddress { get; set; } = string.Empty;

    public string CompanyApartment { get; set; } = string.Empty;

    public string CompanyPostalCode { get; set; } = string.Empty;

    public string CompanyPhoneNumber { get; set; } = string.Empty;

    public string? Comments { get; set; }

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public List<CompanySupplierFile> Files { get; set; } = new();

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;
}
