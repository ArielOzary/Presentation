using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Quotes.Queries.GetClientQuotes;

public sealed class GetClientQuotesQueryModel
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}

public sealed class GetClientQuotesQuery : IRequest<PaginatedList<ClientQuoteDto>>
{
    public GetClientQuotesQuery(GetClientQuotesQueryModel model, string userId)
    {
        PageNumber = model.PageNumber;
        PageSize = model.PageSize;
        UserId = userId;
    }

    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string UserId { get; set; }
}

public sealed class GetClientQuotesQueryHandler : IRequestHandler<GetClientQuotesQuery, PaginatedList<ClientQuoteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetClientQuotesQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedList<ClientQuoteDto>> Handle(GetClientQuotesQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Quotes
            .AsNoTracking()
            .Where(x => x.CompanyId == _currentUserService.CompanyId && x.UserId == request.UserId && x.IsCustom == false)
            .OrderByDescending(x => x.Created)
            .ProjectTo<ClientQuoteDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
