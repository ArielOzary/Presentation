using AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;
using AutoLog.Application.Common.Interfaces;
using MediatR;

namespace AutoLog.Application.Geo.Queries.GetContainerShortInfo;

public sealed class GetContainerShortInfoQuery : IRequest<TrackingRouteData>
{
    public string ContainerNumber { get; set; } = string.Empty;
}

public sealed class GetContainerShortInfoQueryHandler : IRequestHandler<GetContainerShortInfoQuery, TrackingRouteData>
{
    private readonly IContainersTrackerService _trackerService;

    public GetContainerShortInfoQueryHandler(IContainersTrackerService trackerService)
    {
        _trackerService = trackerService;
    }

    public async Task<TrackingRouteData> Handle(GetContainerShortInfoQuery request, CancellationToken cancellationToken)
    {
        var info = await _trackerService.GetShipmentRouteAsync(request.ContainerNumber);

        return info;
    }
}