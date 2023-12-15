using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Shipments.Queries.GetShipments;

public sealed class GetShipmentsQuery : ShipmentFilterDto, IRequest<PaginatedList<ShipmentListDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}

public sealed class GetShipmentsQueryHandler : IRequestHandler<GetShipmentsQuery, PaginatedList<ShipmentListDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _userService;

    public GetShipmentsQueryHandler(IMapper mapper, IApplicationDbContext context, ICurrentUserService userService)
    {
        _mapper = mapper;
        _context = context;
        _userService = userService;
    }

    public async Task<PaginatedList<ShipmentListDto>> Handle(GetShipmentsQuery request, CancellationToken cancellationToken)
    {
        var shipments = await _context.Shipments
            .Include(x => x.Conversation.Messages)
            .AsNoTracking()
            .ApplyFilters(request, _userService)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        var result = await _context.Shipments
            .AsNoTracking()
            .ApplyFilters(request, _userService)
            .ProjectTo<ShipmentListDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        for(int i = 0; i < shipments.Items.Count; i++)
        {
            if (shipments.Items[i].Conversation is null || !shipments.Items[i].Conversation.Messages.Any())
                continue;

            result.Items[i].UnreadMessagesAmount = shipments.Items[i].Conversation.Messages.Count(x => x.Unread && x.UserId != _userService.UserId);
            result.Items[i].Unread = shipments.Items[i].Conversation.Messages.Any(x => x.Unread && x.UserId != _userService.UserId);
        }

        return result;
    }
}
