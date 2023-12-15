namespace AutoLog.Domain.Entities;

public class CompanyLocationAddress : BaseEntity
{
    public string Address { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string Apartment { get; set; } = string.Empty;
}
