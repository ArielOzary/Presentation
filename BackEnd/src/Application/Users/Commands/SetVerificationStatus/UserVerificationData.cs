using AutoLog.Domain.Enums;

namespace AutoLog.Application.Users.Commands.SetVerificationStatus;

public sealed class UserVerificationData
{
    public UserVerificationStatus Status { get; set; }

    public string Email { get; set; } = string.Empty;

    public string ContactName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string VerificationToken { get; set; } = string.Empty;
}
