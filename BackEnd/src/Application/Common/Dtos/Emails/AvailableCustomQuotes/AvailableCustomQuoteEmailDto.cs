using AutoLog.Application.Common.Dtos.NewAvailableQuotes;

namespace AutoLog.Application.Common.Dtos.Emails.AvailableCustomQuotes;

public sealed class AvailableCustomQuoteEmailDto : BaseEmailDto
{
    public string FirstName { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;

    public int QUOTE_ID { get; set; }

    public List<RateOptionResponseDto> RateOptions { get; set; } = new();
}
