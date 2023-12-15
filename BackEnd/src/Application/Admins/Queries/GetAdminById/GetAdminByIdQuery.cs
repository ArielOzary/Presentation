using AutoLog.Application.Admins.Queries.GetAdmins;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Admins.Queries.GetAdminById;

public sealed class GetAdminByIdQuery : IRequest<AdminDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetAdminByIdQueryHanlder : IRequestHandler<GetAdminByIdQuery, AdminDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAdminByIdQueryHanlder(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<AdminDto?> Handle(GetAdminByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == request.Id && x.UserRoles.Any(r => r.Role.Name == Roles.Admin))
            .ProjectTo<AdminDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}
