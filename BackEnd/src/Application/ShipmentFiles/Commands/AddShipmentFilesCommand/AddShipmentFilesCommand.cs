using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.ShipmentFiles.Commands.AddShipmentFilesCommand;

public sealed class AddShipmentFilesCommand : IRequest
{
    public string ShipmentId { get; set; } = string.Empty;

    public List<IFormFile> Files { get; set; } = new();
}

public sealed class AddShipmentFilesCommandHandler : IRequestHandler<AddShipmentFilesCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<ShipmentFile, string> _attachmentFileService;

    public AddShipmentFilesCommandHandler(
        IApplicationDbContext context,
        IAttachmentFileService<ShipmentFile, string> attachmentFileService)
    {
        _context = context;
        _attachmentFileService = attachmentFileService;
    }

    public async Task<Unit> Handle(AddShipmentFilesCommand request, CancellationToken cancellationToken)
    {
        var shipment = await _context.Shipments.FirstOrDefaultAsync(x => x.Id == request.ShipmentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        await _attachmentFileService.AddFilesAsync(shipment.Id!, request.Files, cancellationToken);

        return Unit.Value;
    }
}
