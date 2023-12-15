using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.ShipmentStatuses.Commands.UpdateShipmentStatus;

public sealed class UpdateShipmentStatusCommand : IRequest
{
    [JsonIgnore]
    public int Id { get; set; }

    public ShipmentStatusStage Stage { get; set; }

    public string Info { get; set; } = string.Empty;
}

public sealed class UpdateShipmentStatusCommandHandler : IRequestHandler<UpdateShipmentStatusCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateShipmentStatusCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateShipmentStatusCommand request, CancellationToken cancellationToken)
    {
        var shipmentStatus = await _context.ShipmentStatuses
            .FirstOrDefaultAsync(shipmentStatus => shipmentStatus.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_STATUS_NOT_FOUND);

        _mapper.Map(request, shipmentStatus);

        _context.ShipmentStatuses.Update(shipmentStatus);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
