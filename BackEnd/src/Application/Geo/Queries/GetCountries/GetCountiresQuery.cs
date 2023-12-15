using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Geo.Queries.GetCountries;

public sealed class GetCountiresQuery : IRequest<List<string>>
{
    public PortType? PortType { get; set; }

    public string? Search { get; set; }
}

public sealed class GetCountiresQueryHandler : IRequestHandler<GetCountiresQuery, List<string>>
{
    private readonly IApplicationDbContext _context;

    public GetCountiresQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> Handle(GetCountiresQuery request, CancellationToken cancellationToken)
    {
        var countries = await _context.Ports
            .AsNoTracking()
            .WhereIf(request.PortType is not null, x => x.PortType == request.PortType)
            .WhereIf(request.Search is not null, x => x.Country.ToLower().StartsWith(request.Search!.ToLower()))
            .Where(x => !string.IsNullOrEmpty(x.Country) && x.Latitude != 0.0)
            .Select(x => x.Country)
            .ToListAsync(cancellationToken);

        // Triming because of fail in seeding
        return countries
            .Order()
            .Select(x => x.Trim())
            .Distinct()
            .ToList();
    }
}
