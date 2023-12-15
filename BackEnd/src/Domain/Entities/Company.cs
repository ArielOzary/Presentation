namespace AutoLog.Domain.Entities;

public class Company : BaseAuditableEntity
{
    public string NameEn { get; set; } = string.Empty;

    public string NameHe { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string LegalNumber { get; set; } = string.Empty;

    public string Fax { get; set; } = string.Empty;

    public string VATNumber { get; set; } = string.Empty;

    public List<CompanyContact>? Contacts { get; set; }

    public List<Rate> Rates { get; set; } = new();

    public List<Quote> Quotes { get; set; } = new();

    public int? LocationId { get; set; }

    public CompanyLocation? Location { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public int? IndustryTypeId { get; set; }

    public IndustryType? IndustryType { get; set; }

    public List<Shipment> Shipments { get; set; } = new();
}
