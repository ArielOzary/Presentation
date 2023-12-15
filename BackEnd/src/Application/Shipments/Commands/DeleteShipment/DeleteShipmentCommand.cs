using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.Shipments;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Shipments.Commands.DeleteShipment;

public sealed class DeleteShipmentCommand : IRequest
{
    [JsonIgnore]
    public string Id { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;
}

public sealed class DeleteShipmentCommandHandler : IRequestHandler<DeleteShipmentCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IAttachmentFileService<ShipmentFile, string> _attachmentFileService;

    public DeleteShipmentCommandHandler(
        IApplicationDbContext context,
        IEmailService emailService,
        IAttachmentFileService<ShipmentFile, string> attachmentFileService)
    {
        _context = context;
        _emailService = emailService;
        _attachmentFileService = attachmentFileService;
    }

    public async Task<Unit> Handle(DeleteShipmentCommand request, CancellationToken cancellationToken)
    {
        var shipment = await _context.Shipments
            .Include(x => x.Quote)
            .Include(x => x.User!.Company.Contacts)
            .FirstOrDefaultAsync(shipment => shipment.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        var files = await _context.ShipmentFiles.Where(x => x.ShipmentId == shipment.Id).ToListAsync(cancellationToken);

        // Removing suppliers file with him
        if (files is not null && files.Any())
        {
            foreach (var file in files)
            {
                await _attachmentFileService.RemoveFileAsync(file.Id!, cancellationToken);
            }
        }

        _context.Shipments.Remove(shipment);
        await _context.SaveChangesAsync(cancellationToken);

        shipment.Quote!.HasShipment = false;

        await SendEmailAsync(request, shipment);

        return Unit.Value;
    }

    private async Task SendEmailAsync(DeleteShipmentCommand request, Shipment shipment)
    {
        if (shipment.User is not null)
            await _emailService.SendDeleteShipmentAsync(new DeleteShipmentEmailDto
            {
                Email = shipment.User.Email!,
                Reason = request.Reason,
                ShipmentId = shipment.Id!,
                ShipmentName = $"FREIGHT-{shipment.Id![..13]}",
                ClientName = shipment.User.Company.Contacts!
                    .First(x => x.CompanyId == shipment.User.Company.Id && x.ContactType == CompanyContactType.Basic).Name,
                Locale = shipment.User.Locale
            });
    }
}
