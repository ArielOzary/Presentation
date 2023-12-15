using AutoLog.Application.Common.Dtos.ShipmentTrackingAPI;
using AutoLog.Application.Common.Interfaces;
using MediatR;

namespace AutoLog.Application.Geo.Queries.GetConatinerFullInfo;

public sealed class GetContainerFullInfoQuery : IRequest<ShipmentTrackingRoot>
{
    public string ContainerNumber { get; set; } = string.Empty;
}

public sealed class GetContainerFullInfoQueryHandler : IRequestHandler<GetContainerFullInfoQuery, ShipmentTrackingRoot>
{
    private readonly IContainersTrackerService _trackerService;

    public GetContainerFullInfoQueryHandler(IContainersTrackerService trackerService)
    {
        _trackerService = trackerService;
    }

    public async Task<ShipmentTrackingRoot> Handle(GetContainerFullInfoQuery request, CancellationToken cancellationToken)
    {
        var info = await _trackerService.GetShipmentFullDataAsync(request.ContainerNumber);

        return info;
    }
}