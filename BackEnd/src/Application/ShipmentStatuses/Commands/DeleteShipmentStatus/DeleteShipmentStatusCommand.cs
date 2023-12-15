using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.ShipmentStatuses.Commands.DeleteShipmentStatus;

public sealed class DeleteShipmentStatusCommand : IRequest
{
    public int Id { get; set; }
}

public sealed class DeleteShipmentStatusCommandHandler : IRequestHandler<DeleteShipmentStatusCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteShipmentStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteShipmentStatusCommand request, CancellationToken cancellationToken)
    {
        var shipmentStatus = await _context.ShipmentStatuses
            .Include(x => x.ParentShipmentStatus)
            .Include(x => x.ChildrenShipmentStatuses)
            .FirstOrDefaultAsync(shipmentStatus => shipmentStatus.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_STATUS_NOT_FOUND);

        if (shipmentStatus.ParentShipmentStatus is null)
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        // In case of removing intermidiate status we need to reset parent
        var childrenStatuses = shipmentStatus.ChildrenShipmentStatuses;

        foreach (var childStatus in childrenStatuses)
        {
            childStatus.ParentShipmentStatus = shipmentStatus.ParentShipmentStatus;
        }

        _context.ShipmentStatuses.UpdateRange(childrenStatuses);
        _context.ShipmentStatuses.Remove(shipmentStatus);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
