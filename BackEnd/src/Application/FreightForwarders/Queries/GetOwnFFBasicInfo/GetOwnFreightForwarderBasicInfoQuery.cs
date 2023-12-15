using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetOwnFFBasicInfo;

public sealed class GetOwnFreightForwarderBasicInfoQuery : IRequest<OwnFreightForwarderBasicInfoDto?>
{
}

public sealed class GetOwnFreightForwarderBasicInfoQueryHandler : IRequestHandler<GetOwnFreightForwarderBasicInfoQuery, OwnFreightForwarderBasicInfoDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetOwnFreightForwarderBasicInfoQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _mapper = mapper;
        _currentUserService = currentUserService;
        _context = context;
    }
    public async Task<OwnFreightForwarderBasicInfoDto?> Handle(GetOwnFreightForwarderBasicInfoQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == _currentUserService.UserId)
            .ProjectTo<OwnFreightForwarderBasicInfoDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
