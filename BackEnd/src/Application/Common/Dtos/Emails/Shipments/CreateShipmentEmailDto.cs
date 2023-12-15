namespace AutoLog.Application.Common.Dtos.Emails.Shipments;

public sealed class CreateShipmentEmailDto : BaseEmailDto
{
    public string FirstName { get; set; } = string.Empty;

    public string ShipmentName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public int QuoteId { get; set; }

    public int RateId { get; set; }

    public string SupplierName { get; set; } = string.Empty;

    public string SupplierContactPhone { get; set; } = string.Empty;

    public string SupplierContactEmail { get; set; } = string.Empty;

    public string SupplierAddress { get; set; } = string.Empty;

    public string SupplierApartment { get; set; } = string.Empty;

    public string SupplierPostalCode { get; set; } = string.Empty;

    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;
}
