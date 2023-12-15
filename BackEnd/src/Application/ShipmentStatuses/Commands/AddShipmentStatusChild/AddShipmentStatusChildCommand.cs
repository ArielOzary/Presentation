using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.ShipmentStatuses.Commands.DeleteShipmentStatus;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.ShipmentStatuses.Commands.AddShipmentStatusChild;

public sealed class AddShipmentStatusChildCommand : IRequest
{
    public int ParentId { get; set; }

    public ShipmentStatusStage Stage { get; set; }

    public string Info { get; set; } = string.Empty;
}

public sealed class AddShipmentStatusChildCommandHandler : IRequestHandler<AddShipmentStatusChildCommand>
{
    private readonly IApplicationDbContext _context;

    private readonly ISender _sender;

    public AddShipmentStatusChildCommandHandler(IApplicationDbContext context, ISender sender)
    {
        _context = context;
        _sender = sender;
    }

    public async Task<Unit> Handle(AddShipmentStatusChildCommand request, CancellationToken cancellationToken)
    {
        var shipmentStatus = await _context.ShipmentStatuses
            .Include(x => x.ChildrenShipmentStatuses)
            .FirstOrDefaultAsync(shipmentStatus => shipmentStatus.Id == request.ParentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_STATUS_NOT_FOUND);

        // In case if shipment was delivered it can`t be delayed anymore
        await CheckDeliverAsync(request, shipmentStatus, cancellationToken);

        shipmentStatus.ChildrenShipmentStatuses.Add(new ShipmentStatus
        {
            Stage = request.Stage,
            StageString = request.Stage.ToString(),
            Info = request.Info,
            ShipmentId = shipmentStatus.ShipmentId,
            ParentShipmentStatusId = shipmentStatus.Id,
            ParentShipmentStatus = shipmentStatus
        });

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }

    private async Task CheckDeliverAsync(
        AddShipmentStatusChildCommand request,
        ShipmentStatus shipmentStatus,
        CancellationToken cancellationToken)
    {
        var deliveredStatus = shipmentStatus.ChildrenShipmentStatuses
            .FirstOrDefault(x => x.Stage == ShipmentStatusStage.Delivered && x.ShipmentId == shipmentStatus.ShipmentId);
        if (deliveredStatus is not null)
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        if (request.Stage == ShipmentStatusStage.Delivered)
        {
            var delayedStatuses = shipmentStatus.ChildrenShipmentStatuses
                .Where(x => x.Stage == ShipmentStatusStage.Delayed && x.ShipmentId == shipmentStatus.ShipmentId)
                .ToList();

            if (delayedStatuses is not null && delayedStatuses.Any())
                foreach (var delayedStatus in delayedStatuses)
                    await _sender.Send(new DeleteShipmentStatusCommand { Id = delayedStatus.Id }, cancellationToken);
        }
    }
}
