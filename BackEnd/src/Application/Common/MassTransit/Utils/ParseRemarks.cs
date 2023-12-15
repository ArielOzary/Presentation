namespace AutoLog.Application.Common.MassTransit.Utils;

public sealed class ParseRemarks
{
    public DateTime? ETA { get; set; }

    public DateTime? ETD { get; set; }

    public string ContainerNumber { get; set; } = string.Empty;
}
