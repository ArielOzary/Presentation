using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Clients.Queries.GetOwnClientProfile;

public sealed class GetOwnClientProfileQuery : IRequest<OwnClientProfileDto?>
{
}

public sealed class GetOwnClientProfileQueryQueryHandler : IRequestHandler<GetOwnClientProfileQuery, OwnClientProfileDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetOwnClientProfileQueryQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<OwnClientProfileDto?> Handle(GetOwnClientProfileQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == _currentUserService.UserId && x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .ProjectTo<OwnClientProfileDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
