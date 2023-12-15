using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Queries.GetFFContactsById;

public sealed class GetFreightForwarderContactsByIdQuery : IRequest<FreightForwarderContactsDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetFreightForwarderContactsByIdQueryHandler : IRequestHandler<GetFreightForwarderContactsByIdQuery, FreightForwarderContactsDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetFreightForwarderContactsByIdQueryHandler(IMapper mapper, IApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<FreightForwarderContactsDto?> Handle(GetFreightForwarderContactsByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .Where(x => x.Id == request.Id)
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .ProjectTo<FreightForwarderContactsDto?>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        var providerInfo = await _context.ProviderInfos
            .FirstOrDefaultAsync(x => x.UserId == request.Id, cancellationToken);

        if (providerInfo is not null && result is not null)
            ContactListValidator.ValidateContactList(providerInfo, result.CompanyContacts);

        return result;
    }
}
