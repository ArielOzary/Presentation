namespace AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

public sealed class TrackingRoute
{
    public TrackingPortData Prepol { get; set; } = null!;

    public TrackingPortData Pol { get; set; } = null!;

    public TrackingPortData Pod { get; set; } = null!;

    public TrackingPortData Postpod { get; set; } = null!;
}
