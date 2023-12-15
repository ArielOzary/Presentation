using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Events.Clients;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Clients.Commands.UpdateClientProfits;

public sealed class UpdateClientProfitsCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public double LCL { get; set; }

    public double FCL { get; set; }

    public double Air { get; set; }

    public double CustomClearance { get; set; }

    public double OriginCharges { get; set; }

    public double DestinationCharges { get; set; }
}

public sealed class UpdateClientProfitsCommandHandler : IRequestHandler<UpdateClientProfitsCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateClientProfitsCommandHandler(IApplicationDbContext applicationDbContext,
        IMapper mapper)
    {
        _context = applicationDbContext;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateClientProfitsCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.ClientProfits)
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        if (user.ClientProfits is null)
        {
            user.ClientProfits = _mapper.Map<ClientProfits>(request);
            user.ClientProfits.UserId = user.Id;
            await _context.ClientProfits.AddAsync(user.ClientProfits, cancellationToken);
        }
        else
        {
            _mapper.Map(request, user.ClientProfits);
            _context.ClientProfits.Update(user.ClientProfits);
        }

        var eventClientVerified = new ClientVerifiedEvent(user);
        user.ClientProfits.AddDomainEvent(eventClientVerified);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
