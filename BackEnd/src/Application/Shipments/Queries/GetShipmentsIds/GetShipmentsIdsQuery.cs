using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Shipments.Queries.GetShipmentsIds;

public sealed class GetShipmentsIdsQuery : IRequest<PaginatedList<string>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}

public sealed class GetShipmentsIdsQueryHandler : IRequestHandler<GetShipmentsIdsQuery, PaginatedList<string>>
{
    private readonly IApplicationDbContext _context;

    public GetShipmentsIdsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<string>> Handle(GetShipmentsIdsQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Shipments
            .AsNoTracking()
            .Select(x => x.Id!)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}