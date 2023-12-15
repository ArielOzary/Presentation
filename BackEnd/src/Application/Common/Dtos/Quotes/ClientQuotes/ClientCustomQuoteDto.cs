namespace AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;

public sealed class ClientCustomQuoteDto : ClientQuoteDto
{
    public int QuoteId { get; set; }

    public string Remarks = string.Empty;

    public int? RateId { get; set; }
}
