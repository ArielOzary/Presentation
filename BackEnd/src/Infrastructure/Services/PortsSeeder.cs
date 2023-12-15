using System.Net.Http.Json;
using AutoLog.Application.Common.Dtos.PortsAPI;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoLog.Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service responsible for seeding ports(air and sea)
/// </summary>
public sealed class PortsSeeder : IPortsSeeder
{
    private readonly HttpClient _httpClient;
    private readonly IApplicationDbContext _context;
    private readonly PortsSeedJobOptions _options;
    private readonly ILogger<PortsSeeder> _logger;

    public PortsSeeder(
        IApplicationDbContext context,
        HttpClient httpClient,
        IOptions<PortsSeedJobOptions> options,
        ILogger<PortsSeeder> logger)
    {
        _context = context;
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    /// <summary>
    /// Method which seeds ports on startup and in cron job
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        try
        {
            var airports = await GetResponseFromAPIAsync(_options.AirportsLink, PortType.Air);
            //var seaports = await GetResponseFromAPIAsync(_options.SeaportsLink, PortType.Ocean);

            var portNames = await _context.Ports.Select(x => x.Name).ToListAsync(cancellationToken);

            //var mergedPorts = seaports.Concat(airports)
            //    .ExceptBy(portNames, x => x.Name).ToList();

            var mergedPorts = airports
                .ExceptBy(portNames, x => x.Name).ToList();

            await _context.Ports.AddRangeAsync(mergedPorts, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message, ex.StackTrace);
        }
    }

    /// <summary>
    /// Method to receive response from ports API
    /// </summary>
    /// <param name="url">Link on API</param>
    /// <param name="portType">Type of the port</param>
    /// <returns>List of created ports</returns>
    /// <exception cref="AutoLogException">Exception thrown in case of error in API</exception>
    private async Task<List<Port>> GetResponseFromAPIAsync(string url, PortType portType)
    {
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            throw new AutoLogException(response.StatusCode.ToString());

        var result = await response.Content.ReadFromJsonAsync<PortResponseDto>();

        return result is null
            ? throw new AutoLogException("Reponse is empty")
            : result.Ports.Select(x => new Port
            {
                Country = x.Properties.Country.Name.Trim(),
                PortType = portType,
                Name = x.Properties.Name.Trim(),
                Province = x.Properties.Region is null ? string.Empty : x.Properties.Region.Name.Trim(),
                Longitude = x.Geometry.Coordinates[0],
                Latitude = x.Geometry.Coordinates[1],
            }).DistinctBy(x => x.Name).ToList();
    }
}
