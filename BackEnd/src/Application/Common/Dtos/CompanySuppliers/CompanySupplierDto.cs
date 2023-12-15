namespace AutoLog.Application.Common.Dtos.Suppliers;

public class CompanySupplierDto
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string ContactName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
}
