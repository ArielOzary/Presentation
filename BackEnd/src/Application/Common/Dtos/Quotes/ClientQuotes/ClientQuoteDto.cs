using AutoLog.Application.Common.Dtos.AttachmentFiles;

namespace AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;

public class ClientQuoteDto : ClientSearchQuoteDto
{
    public int Id { get; set; }

    public List<QuoteFileDto> Files { get; set; } = new();
}
