namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingPortData
{
    public int Location { get; set; }

    public string Date { get; set; } = string.Empty;

    public bool Actual { get; set; }
}
