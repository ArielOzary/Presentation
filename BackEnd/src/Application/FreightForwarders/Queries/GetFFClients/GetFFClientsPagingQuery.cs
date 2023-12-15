using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Clients;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetFFClients;

public sealed class GetFFClientsPagingQuery : IRequest<PaginatedList<ClientDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? CompanyNameQuery { get; set; }
}

public sealed class GetFFClientsPagingQueryHandler : IRequestHandler<GetFFClientsPagingQuery, PaginatedList<ClientDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetFFClientsPagingQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedList<ClientDto>> Handle(GetFFClientsPagingQuery request, CancellationToken cancellationToken)
    {
        //ToDO Maybe need recount filter with CalculatonService for filtering active quotes, maybe some job service for recount quotes for company 
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.Client) && x.Quotes.Any(q => q.CompanyId == _currentUserService.CompanyId))
            .WhereIf(!string.IsNullOrWhiteSpace(request.CompanyNameQuery),
                x => x.Company.NameEn.ToLower().Contains(request.CompanyNameQuery!.ToLower()))
            .OrderBy(x => x.Quotes.Count)
            .ThenByDescending(x => x.Created)
            .ProjectTo<ClientDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
