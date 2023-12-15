using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Application.Common.Dtos.Company.CompanyLocation;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Clients.Commands.UpdateOwnClientProfile;

public sealed class UpdateOwnClientProfileCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public CompanyProfileUpdateDto CompanyProfile { get; set; } = null!;

    public CompanyLocationProfileUpdateDto CompanyLocation { get; set; } = null!;

    public List<CompanyContactClientProfileUpdateDto> CompanyContacts { get; set; } = null!;
}

public sealed class UpdateOwnClientProfileCommandHandler : IRequestHandler<UpdateOwnClientProfileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateOwnClientProfileCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateOwnClientProfileCommand request, CancellationToken cancellationToken)
    {
        request.UserId = _currentUserService.UserId!;

        var user = await _context.Users
            .Include(x => x.Company)
            .Where(x => x.Id == request.UserId && x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        var companyId = user.Company.Id;

        _mapper.Map(request, user);
        user.Company.Id = companyId;

        _context.Users.Update(user);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
