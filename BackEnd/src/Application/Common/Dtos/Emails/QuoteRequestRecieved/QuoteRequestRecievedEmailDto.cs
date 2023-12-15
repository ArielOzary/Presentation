namespace AutoLog.Application.Common.Dtos.Emails.QuoteRequestRecieved;

public class QuoteRequestRecievedEmailDto : BaseEmailDto
{
    public string ClientName { get; set; } = string.Empty;
}
