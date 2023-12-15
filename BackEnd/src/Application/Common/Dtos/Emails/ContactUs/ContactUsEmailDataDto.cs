namespace AutoLog.Application.Common.Dtos.Emails.ContactUs;

public sealed class ContactUsEmailDataDto
{
    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}
