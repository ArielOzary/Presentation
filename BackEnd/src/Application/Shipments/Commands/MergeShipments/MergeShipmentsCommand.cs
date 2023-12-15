using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Shipments.Commands.MergeShipments;

public sealed class MergeShipmentsCommand : IRequest
{
    public string OldShipmentId { get; set; } = string.Empty;

    public string NewShipmentId { get; set; } = string.Empty;
}

public sealed class MergeShipmentsCommandHandler : IRequestHandler<MergeShipmentsCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public MergeShipmentsCommandHandler(
        IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(MergeShipmentsCommand request, CancellationToken cancellationToken)
    {
        var oldShipment = await _context.Shipments
            .FirstOrDefaultAsync(x => x.Id == request.OldShipmentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        var newShipment = await _context.Shipments
            .FirstOrDefaultAsync(x => x.Id == request.NewShipmentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        _mapper.Map(oldShipment, newShipment);

        newShipment.IsError = true;

        _context.Shipments.Update(newShipment);
        _context.Shipments.Remove(oldShipment);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
