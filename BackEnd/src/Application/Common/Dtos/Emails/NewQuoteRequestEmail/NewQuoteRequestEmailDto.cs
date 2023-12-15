namespace AutoLog.Application.Common.Dtos.Emails.NewQuoteRequestEmail;

public class NewQuoteRequestEmailDto : BaseEmailDto
{
    public string Locale { get; set; } = string.Empty;

    public string FreightForwarderName { get; set; } = string.Empty;

    public string ClientName { get; set; } = string.Empty;

    public int QuoteId { get; set; }
}
