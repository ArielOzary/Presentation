using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetFFLocationById;

public sealed class GetFreightForwarderLocationByIdQuery : IRequest<FreightForwarderLocationDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetFreightForwarderLocationByIdQueryHandler : IRequestHandler<GetFreightForwarderLocationByIdQuery, FreightForwarderLocationDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFreightForwarderLocationByIdQueryHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<FreightForwarderLocationDto?> Handle(GetFreightForwarderLocationByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .ProjectTo<FreightForwarderLocationDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
