using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Quotes.Queries.GetLatestQuotes;

public sealed class GetLatestQuotesQuery : IRequest<List<ClientSearchQuoteDto>>
{
}

public sealed class GetLatestQuotesQueryHandler : IRequestHandler<GetLatestQuotesQuery, List<ClientSearchQuoteDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetLatestQuotesQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<List<ClientSearchQuoteDto>> Handle(GetLatestQuotesQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.RecentQuoteSearchs
            .AsNoTracking()
            .Where(x => x.UserId == _currentUserService.UserId)
            .OrderByDescending(x => x.LastModified)
            .Take(5)
            .ProjectTo<ClientSearchQuoteDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        foreach (var item in result)
        {
            NormalizePolAndPodNameForRecentSearch(item);
        }

        return result;
    }

    private static void NormalizePolAndPodNameForRecentSearch(ClientSearchQuoteDto clientSearches)
    {
        if (!string.IsNullOrEmpty(clientSearches.Origin.PortName) && !string.IsNullOrEmpty(clientSearches.Origin.Country))
        {
            clientSearches.Origin.PortName = $"{clientSearches.Origin.PortName} ({clientSearches.Origin.Country})";
        }

        if (!string.IsNullOrEmpty(clientSearches.Destination.PortName) && !string.IsNullOrEmpty(clientSearches.Destination.Country))
        {
            clientSearches.Destination.PortName = $"{clientSearches.Destination.PortName} ({clientSearches.Destination.Country})";
        }
    }
}