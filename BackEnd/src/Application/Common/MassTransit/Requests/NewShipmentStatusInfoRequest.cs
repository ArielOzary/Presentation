namespace AutoLog.Application.Common.MassTransit.Requests;

public sealed class NewShipmentStatusInfoRequest
{
    public string Pattern { get; set; } = string.Empty;

    public string Data { get; set; } = string.Empty;
}
