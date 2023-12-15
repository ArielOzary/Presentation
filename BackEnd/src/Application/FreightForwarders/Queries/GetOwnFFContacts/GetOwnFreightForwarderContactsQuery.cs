using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetOwnFFContacts;

public sealed class GetOwnFreightForwarderContactsQuery : IRequest<OwnFreightForwarderContactsDto?>
{
}

public sealed class GetOwnFreightForwarderContactsQueryHandler : IRequestHandler<GetOwnFreightForwarderContactsQuery, OwnFreightForwarderContactsDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetOwnFreightForwarderContactsQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<OwnFreightForwarderContactsDto?> Handle(GetOwnFreightForwarderContactsQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .Where(x => x.Id == _currentUserService.UserId)
            .ProjectTo<OwnFreightForwarderContactsDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        var providerInfo = await _context.ProviderInfos
            .FirstOrDefaultAsync(x => x.UserId == _currentUserService.UserId, cancellationToken);

        if (providerInfo is not null && result is not null)
            ContactListValidator.ValidateContactList(providerInfo, result.CompanyContacts);

        return result;
    }
}
