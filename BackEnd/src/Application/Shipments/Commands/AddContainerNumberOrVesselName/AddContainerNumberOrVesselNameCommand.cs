using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Shipments.Commands.AddContainerNumberOrVesselName;

public sealed class AddContainerNumberOrVesselNameCommand : IRequest
{
    [JsonIgnore]
    public string Id { get; set; } = string.Empty;

    public string ContainerNumberOrVesselName { get; set; } = string.Empty;
}

public sealed class AddContainerNumberOrVesselNameCommandHandler : IRequestHandler<AddContainerNumberOrVesselNameCommand>
{
    private readonly IApplicationDbContext _context;

    public AddContainerNumberOrVesselNameCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(AddContainerNumberOrVesselNameCommand request, CancellationToken cancellationToken)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(shipment => shipment.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        shipment.ContainerNumberOrVesselName = request.ContainerNumberOrVesselName;

        _context.Shipments.Update(shipment);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
