using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetOwnFFLocation;

public sealed class GetOwnFreightForwarderLocationQuery : IRequest<OwnFreightForwarderLocationDto?>
{
}

public sealed class GetOwnFreightForwarderLocationQueryHandler : IRequestHandler<GetOwnFreightForwarderLocationQuery, OwnFreightForwarderLocationDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetOwnFreightForwarderLocationQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<OwnFreightForwarderLocationDto?> Handle(GetOwnFreightForwarderLocationQuery request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == _currentUserService.UserId)
            .ProjectTo<OwnFreightForwarderLocationDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
