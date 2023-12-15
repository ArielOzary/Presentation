using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Shipments.Commands.UpdateShipment;

public sealed class UpdateShipmentCommand : IRequest
{
    [JsonIgnore]
    public string Id { get; set; } = string.Empty;

    public string? ContainerNumber { get; set; }

    public DateTime? ETA { get; set; }

    public DateTime? ETD { get; set; }

    public string UserId { get; set; } = string.Empty;
}

public sealed class UpdateShipmentCommandHandler : IRequestHandler<UpdateShipmentCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateShipmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateShipmentCommand request, CancellationToken cancellationToken)
    {
        var shipment = await _context.Shipments
            .FirstOrDefaultAsync(shipment => shipment.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        var user = await _context.Users
            .Include(x => x.Company)
            .FirstOrDefaultAsync(user => user.Id == request.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        if (!string.IsNullOrEmpty(request.ContainerNumber))
            shipment.ContainerNumberOrVesselName = request.ContainerNumber;
        if (request.ETA is not null)
            shipment.ETA = request.ETA.Value;
        if (request.ETD is not null)
            shipment.ETD = request.ETD.Value;
        if (!string.IsNullOrEmpty(request.ContainerNumber) && request.ETA.HasValue
            && request.ETD.HasValue && !string.IsNullOrEmpty(request.UserId))
            shipment.IsError = false;

        shipment.UserId = user.Id;
        shipment.CompanyId = user.Company.Id;

        _context.Shipments.Update(shipment);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
