namespace AutoLog.Application.Common.Dtos.Emails.ContactUs;

public sealed class ContactUsEmailDto : BaseEmailDto
{
    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string EmailAddress { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;
}
