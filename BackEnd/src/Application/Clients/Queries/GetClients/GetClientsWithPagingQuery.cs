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

namespace AutoLog.Application.Clients.Queries.GetClients;

public sealed class GetClientsWithPagingQuery : IRequest<PaginatedList<ClientDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string? CompanyNameQuery { get; set; }
}

public sealed class GetClientsWithPagingQueryHandler : IRequestHandler<GetClientsWithPagingQuery, PaginatedList<ClientDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetClientsWithPagingQueryHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedList<ClientDto>> Handle(GetClientsWithPagingQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Include(x => x.Quotes)
            .Include(x => x.Company.Contacts)
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .WhereIf(_currentUserService.Roles is not null && _currentUserService.Roles.Contains(Roles.FreightForwarder),
                x => x.Quotes.Any(x => x.CompanyId == _currentUserService.CompanyId))
            .WhereIf(!string.IsNullOrWhiteSpace(request.CompanyNameQuery),
                x => x.Company.NameEn.ToLower().Contains(request.CompanyNameQuery!.ToLower()) ||
                    x.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.Name.ToLower().Contains(request.CompanyNameQuery!.ToLower()))
            .OrderBy(x => x.Quotes.Any(x => x.IsCustom))
            .ThenBy(x => x.Status)
            .ThenByDescending(x => x.Created)
            .ProjectTo<ClientDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
