namespace AutoLog.Domain.Entities;

public class ClientProfits : BaseEntity
{
    public double LCL { get; set; } // ocean

    public double FCL { get; set; } // ocean

    public double Air { get; set; } // air

    public double CustomClearance { get; set; } // if client profile is by autolog

    public double OriginCharges { get; set; }

    public double DestinationCharges { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public double TotalProfit => LCL + FCL + Air + CustomClearance + OriginCharges + DestinationCharges;
}
