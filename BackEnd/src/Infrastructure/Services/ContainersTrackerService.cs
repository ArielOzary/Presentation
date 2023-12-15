using System.Net.Http.Json;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service for tracking shipment by container number
/// </summary>
public sealed class ContainersTrackerService : IContainersTrackerService
{
    private readonly HttpClient _httpClient;
    private readonly ContainerTrackingOptions _options;

    public ContainersTrackerService(
        HttpClient httpClient,
        IOptions<ContainerTrackingOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    /// <summary>
    /// Method to receive only route data of the shipment
    /// </summary>
    /// <param name="containerNumber">Container number</param>
    /// <returns>Route of the shipment</returns>
    public async Task<TrackingRouteData> GetShipmentRouteAsync(string containerNumber)
    {
        var response = await GetResponseFromAPIAsync(containerNumber);

        return response.Data.RouteData;
    }

    /// <summary>
    /// Method to receive available data about shipment
    /// </summary>
    /// <param name="containerNumber">Container number</param>
    /// <returns>Full data about shipment available</returns>
    public async Task<ShipmentTrackingRoot> GetShipmentFullDataAsync(string containerNumber)
    {
        var response = await GetResponseFromAPIAsync(containerNumber);

        return response;
    }

    /// <summary>
    /// Method to receive response from tracking API
    /// </summary>
    /// <param name="containerNumber">Container number</param>
    /// <returns>Full data about shipment available</returns>
    /// <exception cref="AutoLogException">Exception thrown in case of unsuccess result</exception>
    private async Task<ShipmentTrackingRoot> GetResponseFromAPIAsync(string containerNumber)
    {
        var url = _options.ApiLink + $"?api_key={_options.ApiKey}&route=true&number={containerNumber}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            throw new AutoLogException(ErrorCodes.TRACKING_API_ERROR);

        var result = await response.Content.ReadFromJsonAsync<ShipmentTrackingRoot>();

        if (result is null || result.Message != "OK")
            throw new AutoLogException(ErrorCodes.EMPTY_RESPONSE);

        return result;
    }
}
