using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.ShipmentFiles.Commands.DeleteShipmentFileCommand;

public sealed class DeleteShipmentFileCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}

public sealed class DeleteShipmentFileCommandHandler : IRequestHandler<DeleteShipmentFileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<ShipmentFile, string> _attachmentFileService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteShipmentFileCommandHandler(
        IAttachmentFileService<ShipmentFile, string> attachmentFileService,
        ICurrentUserService currentUserService,
        IApplicationDbContext context)
    {
        _attachmentFileService = attachmentFileService;
        _currentUserService = currentUserService;
        _context = context;
    }

    public async Task<Unit> Handle(DeleteShipmentFileCommand request, CancellationToken cancellationToken)
    {
        var shipmentFile = await _context.ShipmentFiles.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        if (_currentUserService.UserId != shipmentFile.CreatedBy && !_currentUserService.Roles!.Contains(Roles.Admin))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        await _attachmentFileService.RemoveFileAsync(shipmentFile.Id!, cancellationToken);

        return Unit.Value;
    }
}
