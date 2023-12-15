using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Ports.Queries;

public sealed class GetPortsListQuery : IRequest<List<PortDto>>
{
    public PortType? PortType { get; set; }

    public string? Country { get; set; }

    public string? Search { get; set; }
}

public sealed class GetPortsListQueryHandler : IRequestHandler<GetPortsListQuery, List<PortDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPortsListQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<PortDto>> Handle(GetPortsListQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Ports
            .AsNoTracking()
            .WhereIf(request.PortType is not null, x => x.PortType == request.PortType)
            .WhereIf(request.Country is not null, x => x.Country == request.Country)
            .WhereIf(request.Search is not null, x => x.Name.ToLower().StartsWith(request.Search!.ToLower()))
            .Where(x => !string.IsNullOrEmpty(x.Name) && x.Longitude != default && x.Latitude != default)
            .OrderBy(x => x.Name)
            .ProjectToListAsync<PortDto>(_mapper.ConfigurationProvider);

        return result;
    }
}
