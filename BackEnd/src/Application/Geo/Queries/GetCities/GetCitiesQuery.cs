using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Geo.Queries.GetCities;

public sealed class GetCitiesQuery : IRequest<List<string>>
{
    public PortType? PortType { get; set; }

    public string Country { get; set; } = string.Empty;

    public string? Search { get; set; }
}

public sealed class GetCitiesQueryHandler : IRequestHandler<GetCitiesQuery, List<string>>
{
    private readonly IApplicationDbContext _context;

    public GetCitiesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> Handle(GetCitiesQuery request, CancellationToken cancellationToken)
    {
        var cities = await _context.Ports
            .AsNoTracking()
            .WhereIf(!string.IsNullOrEmpty(request.Country), x => x.Country.Equals(request.Country))
            .WhereIf(request.PortType is not null, x => x.PortType == request.PortType)
            .WhereIf(request.Search is not null, x => x.Province.ToLower().StartsWith(request.Search!.ToLower()))
            .Where(x => !string.IsNullOrEmpty(x.Province))
            .Select(x => x.Province)
            .ToListAsync(cancellationToken);

        // Triming because of fail in seeding
        return cities
            .Order()
            .Select(x => x.Trim())
            .Distinct()
            .ToList();
    }
}
