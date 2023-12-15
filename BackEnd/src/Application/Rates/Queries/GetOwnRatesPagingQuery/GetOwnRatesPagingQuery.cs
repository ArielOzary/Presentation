using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoLog.Application.Rates.Queries.GetRatesWithPagingQuery;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Rates.Queries.GetOwnRatesPagingQuery;

public sealed class GetOwnRatesPagingQuery : IRequest<PaginatedList<RateDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? NameQuery { get; set; }
}

public sealed class GetOwnRatesPagingQueryHandler : IRequestHandler<GetOwnRatesPagingQuery, PaginatedList<RateDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetOwnRatesPagingQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedList<RateDto>> Handle(GetOwnRatesPagingQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId;

        var result = await _context.Rates
            .AsNoTracking()
            .Where(x => x.CompanyId == companyId)
            .WhereIf(!string.IsNullOrWhiteSpace(request.NameQuery),
                x => x.Name.ToLower().Contains(request.NameQuery!.ToLower()))
            .OrderByDescending(x => x.Created)
            .ProjectTo<RateDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
