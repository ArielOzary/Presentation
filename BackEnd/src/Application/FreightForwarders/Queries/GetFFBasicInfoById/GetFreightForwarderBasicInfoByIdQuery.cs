using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetFFBasicInfoById;

public sealed class GetFreightForwarderBasicInfoByIdQuery : IRequest<FreightForwarderBasicInfoDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetFreightForwarderBasicInfoByIdQueryHandler : IRequestHandler<GetFreightForwarderBasicInfoByIdQuery, FreightForwarderBasicInfoDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFreightForwarderBasicInfoByIdQueryHandler(IMapper mapper, IApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<FreightForwarderBasicInfoDto?> Handle(GetFreightForwarderBasicInfoByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .ProjectTo<FreightForwarderBasicInfoDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
