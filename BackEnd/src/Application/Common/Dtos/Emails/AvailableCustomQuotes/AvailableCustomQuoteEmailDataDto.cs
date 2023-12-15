using AutoLog.Application.Common.Dtos.NewAvailableQuotes;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AutoLog.Application.Common.Dtos.Emails.AvailableCustomQuotes;

public sealed class AvailableCustomQuoteEmailDataDto
{
    public string FirstName { get; set; } = string.Empty;

    [JsonProperty(PropertyName = "QUOTE_ID", NamingStrategyType = typeof(DefaultNamingStrategy))]
    public string QUOTE_ID { get; set; } = string.Empty;

    public List<RateOptionResponseDto> RateOptions { get; set; } = new();
}
