using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Quotes.Queries.GetQuote;

public sealed class GetQuoteByIdQuery : IRequest<ClientQuoteDto?>
{
    public int Id { get; set; }
}

public sealed class GetQuoteByIdQueryHandler : IRequestHandler<GetQuoteByIdQuery, ClientQuoteDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetQuoteByIdQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<ClientQuoteDto?> Handle(GetQuoteByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Quotes
            .AsNoTracking()
            .WhereIf(_currentUserService.Roles is not null && _currentUserService.Roles.Contains(Roles.FreightForwarder),
                x => x.CompanyId == _currentUserService.CompanyId)
            .ProjectTo<ClientQuoteDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        return result;
    }
}
