namespace AutoLog.Application.Common.Dtos.NewAvailableQuotes;

public sealed class QuoteResponseDto
{
    public int QuoteId { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string UserEmail { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string Locale { get; set; } = string.Empty;

    public List<RateOptionResponseDto> Rates { get; set; } = new();
}
