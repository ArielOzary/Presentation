namespace AutoLog.Domain.Entities;

/// <summary>
/// Freight Forwarder Provider Info
/// </summary>
public class ProviderInfo : BaseEntity
{
    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public bool Customs { get; set; }

    public bool Ocean { get; set; }

    public bool Air { get; set; }

    public bool Payment { get; set; }
}
