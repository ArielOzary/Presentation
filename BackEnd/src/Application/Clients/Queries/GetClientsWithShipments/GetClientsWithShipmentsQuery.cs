using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Clients.Queries.GetClientsWithShipments;

public sealed class GetClientsWithShipmentsQuery : IRequest<PaginatedList<ClientShipmentDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}

public sealed class GetClientsWithShipmentsQueryHandler : IRequestHandler<GetClientsWithShipmentsQuery, PaginatedList<ClientShipmentDto>>
{
    private readonly ICurrentUserService _userService;
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClientsWithShipmentsQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService userService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<PaginatedList<ClientShipmentDto>> Handle(GetClientsWithShipmentsQuery request, CancellationToken cancellationToken)
    {
        if (!_userService.Roles!.Contains(Roles.Admin) && !_userService.Roles!.Contains(Roles.FreightForwarder))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        var result = await _context.Users
            .AsNoTracking()
            .Include(x => x.Shipments)
            .Where(x => x.Shipments.Any())
            .ProjectTo<ClientShipmentDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
