using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Companies.Queries.GetFFDtoByCompanyId;

public sealed class GetFreightForwarderDtoByCompanyIdQuery : IRequest<FreightForwarderCompanyDto?>
{
    public int Id { get; set; }
}

public sealed class GetFreightForwarderDtoByCompanyIdQueryHandler : IRequestHandler<GetFreightForwarderDtoByCompanyIdQuery, FreightForwarderCompanyDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFreightForwarderDtoByCompanyIdQueryHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<FreightForwarderCompanyDto?> Handle(GetFreightForwarderDtoByCompanyIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.Company.Id == request.Id && x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .ProjectTo<FreightForwarderCompanyDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
