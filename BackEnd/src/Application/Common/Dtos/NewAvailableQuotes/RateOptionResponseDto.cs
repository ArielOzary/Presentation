namespace AutoLog.Application.Common.Dtos.NewAvailableQuotes;

public sealed class RateOptionResponseDto
{
    public int Index { get; set; }

    public string? CarrierName { get; set; }

    public int TransitTime { get; set; }

    public double Cost { get; set; }
}
