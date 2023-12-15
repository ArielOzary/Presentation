using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Clients.Queries.GetClientProfileById;

public sealed class GetClientProfileByIdQuery : IRequest<ClientProfileDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetClientProfileByIdQueryHandler : IRequestHandler<GetClientProfileByIdQuery, ClientProfileDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetClientProfileByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ClientProfileDto?> Handle(GetClientProfileByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Include(x => x.Company.Contacts)
            .Include(u => u.Company.Location!.InLandAddress)
            .Include(u => u.Company.Location!.MailingAddress)
            .Include(ur => ur.UserRoles)
                .ThenInclude(r => r.Role)
            .Where(x => x.Id == request.Id && x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .ProjectTo<ClientProfileDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
