using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Clients;

public class ClientDto
{
    public string Id { get; set; } = string.Empty;

    public double TotalProfit { get; set; }

    public UserVerificationStatus Status { get; set; }

    public bool IsDeactivated { get; set; }

    public string CompanyNameEn { get; set; } = string.Empty;

    public string ContactName { get; set; } = string.Empty;

    public string ContactPhoneNumber { get; set; } = string.Empty;

    public string ContactEmail { get; set; } = string.Empty;

    public string ContactJobTitle { get; set; } = string.Empty;

    public bool HasCustomQuote { get; set; }
}
