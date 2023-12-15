namespace AutoLog.Domain.Entities;

public class CompanyLocation : BaseEntity
{
    public bool MadeBySystem { get; set; }

    public bool Insurance { get; set; }

    public string InLandAuthority { get; set; } = string.Empty;

    public bool CustomClearance { get; set; }

    public string Comments { get; set; } = string.Empty;

    public int InLandAddressId { get; set; }

    public CompanyLocationAddress InLandAddress { get; set; } = null!;

    public int MailingAddressId { get; set; }

    public CompanyLocationAddress MailingAddress { get; set; } = null!;

    public int? DestinationPortId { get; set; }

    public Port? DestinationPort { get; set; }
}
