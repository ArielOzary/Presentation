using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company.CompanyLocation;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.FreightForwarders.Commands.UpdateFFLocation;

public sealed class UpdateFreightForwarderLocationCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public CompanyLocationFFProfileUpdateDto CompanyLocation { get; set; } = null!;
}

public sealed class UpdateFreightForwarderLocationCommandHandler : IRequestHandler<UpdateFreightForwarderLocationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateFreightForwarderLocationCommandHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateFreightForwarderLocationCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company.Location!.InLandAddress)
            .Include(x => x.Company.Location!.MailingAddress)
            .Include(ur => ur.UserRoles)
                .ThenInclude(r => r.Role)
            .Where(x => x.Id == request.UserId && x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        _mapper.Map(request.CompanyLocation, user.Company.Location);

        _context.CompanyLocations.Update(user.Company.Location!);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
