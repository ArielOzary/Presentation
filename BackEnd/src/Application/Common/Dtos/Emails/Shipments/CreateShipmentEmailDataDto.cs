namespace AutoLog.Application.Common.Dtos.Emails.Shipments;

public sealed class CreateShipmentEmailDataDto
{
    public string FirstName { get; set; } = string.Empty;

    public string ShipmentName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string QuoteId { get; set; } = string.Empty;

    public string RateId { get; set; } = string.Empty;

    public string SupplierName { get; set; } = string.Empty;

    public string SupplierContactPhone { get; set; } = string.Empty;

    public string SupplierContactEmail { get; set; } = string.Empty;

    public string SupplierAddress { get; set; } = string.Empty;

    public string SupplierApartment { get; set; } = string.Empty;

    public string SupplierPostalCode { get; set; } = string.Empty;

    public string Origin { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;
}
