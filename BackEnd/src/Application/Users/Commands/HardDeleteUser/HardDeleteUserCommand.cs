using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Users.Commands.HardDeleteUser;

public sealed class HardDeleteUserCommand : IRequest
{
    public string UserId { get; set; } = string.Empty;
}

public sealed class HardDeleteUserCommandHandler : IRequestHandler<HardDeleteUserCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAttachmentFileService<MessageFile, string> _attachmentMessageFileService;
    private readonly IAttachmentFileService<QuoteFile, int> _attachmentQuoteFileService;
    private readonly IAttachmentFileService<ShipmentFile, string> _attachmentShipmentFileService;
    private readonly IAttachmentFileService<CompanySupplierFile, int> _attachmentSupplierFileService;

    public HardDeleteUserCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IAttachmentFileService<MessageFile, string> attachmentMessageFileService,
        IAttachmentFileService<QuoteFile, int> attachmentQuoteFileService,
        IAttachmentFileService<ShipmentFile, string> attachmentShipmentFileService,
        IAttachmentFileService<CompanySupplierFile, int> attachmentSupplierFileService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _attachmentMessageFileService = attachmentMessageFileService;
        _attachmentQuoteFileService = attachmentQuoteFileService;
        _attachmentShipmentFileService = attachmentShipmentFileService;
        _attachmentSupplierFileService = attachmentSupplierFileService;
    }

    public async Task<Unit> Handle(HardDeleteUserCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserId))
            request.UserId = _currentUserService.UserId!;

        var user = await _context.Users
            .Include(x => x.Company.Contacts)
            .Include(x => x.Company.Location)
                .ThenInclude(x => x!.InLandAddress)
            .Include(x => x.Company.Location)
                .ThenInclude(x => x!.MailingAddress)
            .Include(x => x.Quotes)
                .ThenInclude(x => x.QuoteFiles)
            .Include(x => x.RecentQuoteSearches)
            .Include(x => x.Shipments)
                .ThenInclude(x => x.ShipmentFiles)
            .Include(x => x.Conversations)
            .Include(x => x.Messages)
                .ThenInclude(x => x.Files)
            .Include(x => x.Suppliers)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        _context.Users.Remove(user);
        RemoveContactsAndLocations(user);
        await RemoveShipmentsInfoAsync(user, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }

    private async Task RemoveShipmentsInfoAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        foreach (var quote in user.Quotes)
        {
            foreach (var file in quote.QuoteFiles)
            {
                await _attachmentQuoteFileService.RemoveFileAsync(file.Id!, cancellationToken);

            }
        }

        if (user.Suppliers is not null && user.Suppliers.Any())
            foreach (var supplier in user.Suppliers)
            {
                foreach (var file in supplier.Files)
                {
                    await _attachmentSupplierFileService.RemoveFileAsync(file.Id!, cancellationToken);

                }
            }

        foreach (var message in user.Messages)
        {
            foreach (var file in message.Files)
            {
                await _attachmentMessageFileService.RemoveFileAsync(file.Id!, cancellationToken);

            }
        }

        foreach (var shipment in user.Shipments)
        {
            foreach (var file in shipment.ShipmentFiles)
            {
                await _attachmentShipmentFileService.RemoveFileAsync(file.Id!, cancellationToken);

            }
        }

        _context.Quotes.RemoveRange(user.Quotes);
        _context.RecentQuoteSearchs.RemoveRange(user.RecentQuoteSearches);
        _context.Shipments.RemoveRange(user.Shipments);
        _context.Conversations.RemoveRange(user.Conversations);
        _context.Messages.RemoveRange(user.Messages);
        _context.CompanySuppliers.RemoveRange(user.Suppliers!);
    }

    private void RemoveContactsAndLocations(ApplicationUser user)
    {
        if (user.Company?.Contacts is not null && user.Company.Contacts.Any())
            _context.CompanyContacts.RemoveRange(user.Company.Contacts);

        if (user.Company?.Location is not null)
        {
            _context.CompanyLocations.Remove(user.Company.Location);
            if (user.Company.Location.InLandAddress is not null)
                _context.CompanyLocationAddresses.Remove(user.Company.Location.InLandAddress);
            if (user.Company.Location.MailingAddress is not null)
                _context.CompanyLocationAddresses.Remove(user.Company.Location.MailingAddress);
        }
    }
}
