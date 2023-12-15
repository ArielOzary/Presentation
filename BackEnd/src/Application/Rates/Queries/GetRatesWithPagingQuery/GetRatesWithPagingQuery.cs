using MediatR;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using AutoLog.Application.Common.Models;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Extensions;

namespace AutoLog.Application.Rates.Queries.GetRatesWithPagingQuery;

public sealed class GetRatesWithPagingQuery : IRequest<PaginatedList<RateDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? NameQuery { get; set; }
}

public sealed class GetRatesWithPagingQueryHandler : IRequestHandler<GetRatesWithPagingQuery, PaginatedList<RateDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRatesWithPagingQueryHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<RateDto>> Handle(GetRatesWithPagingQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Rates
            .AsNoTracking()
            .WhereIf(!string.IsNullOrWhiteSpace(request.NameQuery),
                x => x.Name.ToLower().Contains(request.NameQuery!.ToLower()))
            .OrderByDescending(x => x.Created)
            .ProjectTo<RateDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
