using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Rates.Queries.GetRateChargesByIdQuery;

public sealed class GetRateChargesByIdQuery : IRequest<RateChargesDetailsDto?>
{
    public int Id { get; set; }
}

public sealed class GetRateChargesByIdQueryHandler : IRequestHandler<GetRateChargesByIdQuery, RateChargesDetailsDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetRateChargesByIdQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<RateChargesDetailsDto?> Handle(GetRateChargesByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Rates
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .WhereIf(_currentUserService.Roles is not null && _currentUserService.Roles.Contains(Roles.FreightForwarder),
                x => x.CompanyId == _currentUserService.CompanyId)
            .ProjectTo<RateChargesDetailsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
