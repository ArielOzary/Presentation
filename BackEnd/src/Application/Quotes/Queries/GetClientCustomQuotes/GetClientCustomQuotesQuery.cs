using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Quotes.Queries.GetClientCustomQuotes;

public sealed class GetClientCustomQuotesQueryModel
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}

public sealed class GetClientCustomQuotesQuery : IRequest<PaginatedList<ClientCustomQuoteDto>>
{
    public GetClientCustomQuotesQuery(GetClientCustomQuotesQueryModel query, string userId)
    {
        PageNumber = query.PageNumber;
        PageSize = query.PageSize;
        UserId = userId;
    }

    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string UserId { get; set; } = string.Empty;
}

public sealed class GetClientCustomQuotesQueryHandler : IRequestHandler<GetClientCustomQuotesQuery, PaginatedList<ClientCustomQuoteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClientCustomQuotesQueryHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ClientCustomQuoteDto>> Handle(GetClientCustomQuotesQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Quotes
            .AsNoTracking()
            .OrderByDescending(x => x.Created)
            .Where(x => x.UserId == request.UserId && x.IsCustom == true && !x.IsNotified)
            .ProjectTo<ClientCustomQuoteDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
