using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Reminders.Commands.SetReminderStatus;

public sealed class SetReminderStatusCommand : IRequest
{
    public string ShipmentId { get; set; } = string.Empty;

    public OpenStatusStage OpenStatusStage { get; set; }
    public OpenStatusStage? PreviousStatusStage { get; set; }
}

public sealed class SetReminderStatusCommandHandler : IRequestHandler<SetReminderStatusCommand>
{
    private readonly IApplicationDbContext _context;

    public SetReminderStatusCommandHandler(
        IApplicationDbContext applicationDbContext)
    {
        _context = applicationDbContext;
    }

    public async Task<Unit> Handle(SetReminderStatusCommand request, CancellationToken cancellationToken)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(x => x.Id == request.ShipmentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        shipment.OpenStatusStage = request.OpenStatusStage;
        shipment.PreviousStatusStage = request.PreviousStatusStage;

        _context.Shipments.Update(shipment);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
