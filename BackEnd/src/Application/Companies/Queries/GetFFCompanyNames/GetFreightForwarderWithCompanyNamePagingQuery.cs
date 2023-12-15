using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Companies.Queries.GetFFCompanyNames;

public sealed class GetFreightForwarderWithCompanyNamePagingQuery : IRequest<PaginatedList<FreightForwarderCompanyNameDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? CompanyNameQuery { get; set; }
}

public sealed class GetFreightForwarderWithCompanyNamePagingQueryHandler : IRequestHandler<GetFreightForwarderWithCompanyNamePagingQuery, PaginatedList<FreightForwarderCompanyNameDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFreightForwarderWithCompanyNamePagingQueryHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<FreightForwarderCompanyNameDto>> Handle(GetFreightForwarderWithCompanyNamePagingQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .WhereIf(!string.IsNullOrWhiteSpace(request.CompanyNameQuery),
                x => x.Company.NameEn.ToLower().Contains(request.CompanyNameQuery!.ToLower()))
            .OrderByDescending(x => x.Created)
            .ProjectTo<FreightForwarderCompanyNameDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
