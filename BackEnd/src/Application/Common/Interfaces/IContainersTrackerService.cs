using AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service for tracking shipment by container number
/// </summary>
public interface IContainersTrackerService
{
    /// <summary>
    /// Method to receive only route data of the shipment
    /// </summary>
    /// <param name="containerNumber">Container number</param>
    /// <returns>Route of the shipment</returns>
    Task<TrackingRouteData> GetShipmentRouteAsync(string containerNumber);

    /// <summary>
    /// Method to receive available data about shipment
    /// </summary>
    /// <param name="containerNumber">Container number</param>
    /// <returns>Full data about shipment available</returns>
    Task<ShipmentTrackingRoot> GetShipmentFullDataAsync(string containerNumber);
}
