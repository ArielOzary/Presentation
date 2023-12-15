using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Shipments.Queries.GetShipmentsForMap;

public sealed class GetShipmentsForMapQuery : ShipmentFilterDto, IRequest<List<ShipmentMapDto>>
{
}

public sealed class GetShipmentsForMapQueryHandler : IRequestHandler<GetShipmentsForMapQuery, List<ShipmentMapDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _userService;

    public GetShipmentsForMapQueryHandler(IMapper mapper, IApplicationDbContext context, ICurrentUserService userService)
    {
        _mapper = mapper;
        _context = context;
        _userService = userService;
    }

    public async Task<List<ShipmentMapDto>> Handle(GetShipmentsForMapQuery request, CancellationToken cancellationToken)
    {
        var shipments = await _context.Shipments
            .AsNoTracking()
            .Where(x => x.ShippingType != null)
            .ApplyFilters(request, _userService)
            .ProjectToListAsync<ShipmentMapDto>(_mapper.ConfigurationProvider);

        // In case of searching by zipcode we have to give user at least some coordinates of country his start and finish points are
        await LoadShipmentsCoordinatesForMapAsync(shipments, cancellationToken);

        return shipments;
    }

    private async Task LoadShipmentsCoordinatesForMapAsync(List<ShipmentMapDto> shipments, CancellationToken cancellationToken)
    {
        foreach (var item in shipments.Where(x => x.OriginLongitude == 0.0))
        {
            var originPort = await _context.Ports
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Country == item.OriginCountry && x.Latitude != 0.0, cancellationToken);

            if (originPort is null)
                continue;

            var destinationPort = await _context.Ports
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Country == item.DestinationCountry && x.Latitude != 0.0, cancellationToken);

            if (destinationPort is null)
                continue;

            item.OriginLatitude = originPort.Latitude;
            item.OriginLongitude = originPort.Longitude;
            item.DestinationLongitude = destinationPort.Longitude;
            item.DestinationLatitude = destinationPort.Latitude;
        }
    }
}
