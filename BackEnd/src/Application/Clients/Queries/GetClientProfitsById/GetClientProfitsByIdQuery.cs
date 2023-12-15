using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Clients.Queries.GetClientProfitsById;

public sealed class GetClientProfitsByIdQuery : IRequest<ClientProfitsDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetClientProfitsByIdQueryHandler : IRequestHandler<GetClientProfitsByIdQuery, ClientProfitsDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClientProfitsByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ClientProfitsDto?> Handle(GetClientProfitsByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.ClientProfits
            .AsNoTracking()
            .Where(x => x.UserId == request.Id)
            .ProjectTo<ClientProfitsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
