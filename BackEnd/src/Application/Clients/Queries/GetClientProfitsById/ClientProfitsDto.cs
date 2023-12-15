namespace AutoLog.Application.Clients.Queries.GetClientProfitsById;

public sealed class ClientProfitsDto
{
    public double LCL { get; set; }

    public double FCL { get; set; }

    public double Air { get; set; }

    public double CustomClearance { get; set; }

    public double OriginCharges { get; set; }

    public double DestinationCharges { get; set; }
}
