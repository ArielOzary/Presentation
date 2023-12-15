namespace AutoLog.Infrastructure.Configurations;

public sealed class BackgroundJobOptions
{
    public int QuotePeriodInSeconds { get; set; }

    public int RatePeriodInSeconds { get; set; }

    public int ShipmentStatusesPeriodInSeconds { get; set; }

    public int RateRange { get; set; }

    public int PortsPeriodInDays { get; set; }

    public int RemindPeriodInSeconds { get; set; }
}
