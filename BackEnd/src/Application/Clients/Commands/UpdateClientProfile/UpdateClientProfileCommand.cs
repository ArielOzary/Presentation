using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Application.Common.Dtos.Company.CompanyLocation;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Clients.Commands.UpdateClientProfile;

public sealed class UpdateClientProfileCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public CompanyProfileUpdateDto CompanyProfile { get; set; } = null!;

    public CompanyLocationProfileUpdateDto CompanyLocation { get; set; } = null!;

    public CompanyContactClientProfileUpdateDto CompanyContact { get; set; } = null!;
}

public sealed class UpdateClientProfileCommandHandler : IRequestHandler<UpdateClientProfileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateClientProfileCommandHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateClientProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company)
                .ThenInclude(c => c.Contacts)
            .Include(u => u.Company)
                .ThenInclude(c => c.Location)
                    .ThenInclude(l => l!.InLandAddress)
            .Include(u => u.Company)
                .ThenInclude(c => c.Location)
                    .ThenInclude(l => l!.MailingAddress)
            .Include(ur => ur.UserRoles)
                .ThenInclude(r => r.Role)
            .Where(x => x.Id == request.UserId && x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        await UpdateUserAsync(request, user, cancellationToken);

        return Unit.Value;
    }

    private async Task UpdateUserAsync(UpdateClientProfileCommand request, ApplicationUser user, CancellationToken cancellationToken)
    {
        _mapper.Map(request, user);

        var userContact = user.Company.Contacts?.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic);

        if (userContact is null)
        {
            user.Company.Contacts = new List<CompanyContact>()
            {
                _mapper.Map<CompanyContact>(request.CompanyContact)
            };
        }
        else
        {
            _mapper.Map(request.CompanyContact, userContact);
        }

        _context.Users.Update(user);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
