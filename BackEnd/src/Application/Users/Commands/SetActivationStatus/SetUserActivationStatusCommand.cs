using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Users.Commands.SetActivationStatus;

public sealed class SetUserActivationStatusCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public bool IsDeactivated { get; set; }

    public string? DeactivationReason { get; set; }
}

public sealed class SetUserActivationStatusCommandHandler : IRequestHandler<SetUserActivationStatusCommand>
{
    private readonly IApplicationDbContext _context;

    public SetUserActivationStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(SetUserActivationStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        user.DeactivationReason = request.DeactivationReason;
        user.IsDeactivated = request.IsDeactivated;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}