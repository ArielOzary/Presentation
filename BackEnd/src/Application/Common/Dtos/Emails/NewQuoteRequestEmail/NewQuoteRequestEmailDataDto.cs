namespace AutoLog.Application.Common.Dtos.Emails.NewQuoteRequestEmail;

public class NewQuoteRequestEmailDataDto
{
    public string ForwarderFirstName { get; set; } = string.Empty;

    public string ClientFirstName { get; set; } = string.Empty;

    public string QuoteId { get; set; } = string.Empty;
}
