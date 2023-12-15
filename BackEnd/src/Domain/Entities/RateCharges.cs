namespace AutoLog.Domain.Entities;

public class RateCharges : BaseEntity
{
    public string FixedPriced { get; set; } = string.Empty;

    public string PerWeight { get; set; } = string.Empty;

    public string PerType { get; set; } = string.Empty;

    public string? PerValue { get; set; }

    public string? InLand { get; set; }

    public string? AirFreight { get; set; }

    public string? OceanFreightFcl { get; set; }

    public string? OceanFreightLcl { get; set; }
}
