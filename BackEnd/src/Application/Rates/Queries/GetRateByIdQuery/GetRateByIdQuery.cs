using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Rates.Queries.GetRatesWithPagingQuery;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Rates.Queries.GetRateByIdQuery;

public sealed class GetRateByIdQuery : IRequest<RateDto?>
{
    public int Id { get; set; }
}

public sealed class GetRateByIdQueryHandler : IRequestHandler<GetRateByIdQuery, RateDto?>
{
    private readonly IMapper _mapper;
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetRateByIdQueryHandler(IMapper mapper,
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _mapper = mapper;
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<RateDto?> Handle(GetRateByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Rates
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .WhereIf(_currentUserService.Roles is not null && _currentUserService.Roles.Contains(Roles.FreightForwarder),
                x => x.CompanyId == _currentUserService.CompanyId)
            .ProjectTo<RateDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
