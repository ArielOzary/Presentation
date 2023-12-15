using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoLog.Application.FreightForwarders.Queries.GetFreightForwarders;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetFreightForwardersPaging;

public sealed class GetFreightForwarderPagingQuery : IRequest<PaginatedList<FreightForwarderDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? CompanyNameQuery { get; set; }
}

public sealed class GetFreightForwarderPagingQueryHandler : IRequestHandler<GetFreightForwarderPagingQuery, PaginatedList<FreightForwarderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFreightForwarderPagingQueryHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<FreightForwarderDto>> Handle(GetFreightForwarderPagingQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .WhereIf(!string.IsNullOrWhiteSpace(request.CompanyNameQuery),
                x => x.Company.NameEn.ToLower().Contains(request.CompanyNameQuery!.ToLower()))
            .OrderByDescending(x => x.Created)
            .ProjectTo<FreightForwarderDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
