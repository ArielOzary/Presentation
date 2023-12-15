using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Reminders.Commands.RemindForwarder;

public sealed class RemindForwarderStatusCommand : IRequest
{
    public OpenStatusStage OpenStatusStage { get; set; }

    public string FreightForwarderId { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;

    public DateTime DateToRemind { get; set; }
}

public sealed class RemindForwarderStatusCommandHandler : IRequestHandler<RemindForwarderStatusCommand>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;

    public RemindForwarderStatusCommandHandler(
        ICurrentUserService currentUserService,
        IApplicationDbContext applicationDbContext)
    {
        _currentUserService = currentUserService;
        _context = applicationDbContext;
    }

    public async Task<Unit> Handle(RemindForwarderStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Include(x => x.Company.Contacts)
            .FirstAsync(x => x.Id == _currentUserService.UserId, cancellationToken);

        var freightForwarder = await _context.Users
            .Include(x => x.Company.Contacts)
            .FirstOrDefaultAsync(x => x.Id == request.FreightForwarderId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        var shipment = await _context.Shipments
            .FirstAsync(x => x.Id == request.ShipmentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        shipment.ReminderStatus = ReminderStatus.ReminderPending;

        await SetReminderAsync(request, user, freightForwarder, cancellationToken);

        return Unit.Value;
    }

    private async Task SetReminderAsync(
        RemindForwarderStatusCommand request,
        ApplicationUser user,
        ApplicationUser freightForwarder,
        CancellationToken cancellationToken)
    {
        var emailData = ReminderEmailGenerator.GenerateFreightForwarderDataForEmail(request.OpenStatusStage);
        if (emailData != null)
        {
            var email = new ReminderEmail
            {
                Subject = emailData.Subject,
                ForwarderName = freightForwarder.Company.Contacts!
                .FirstOrDefault(x => x.ContactType == CompanyContactType.Payment)?.Name!,
                ClientFirstName = user.Company.Contacts!
                .First(x => x.ContactType == CompanyContactType.Basic).Name,
                ShipmentId = request.ShipmentId,
                LatestUpdate = emailData.LatestUpdate,
                Email = user.Email!,
                Locale = user.Locale,
                DateToRemind = request.DateToRemind,
            };

            freightForwarder.ReminderEmail = email;
        }
        await _context.SaveChangesAsync(cancellationToken);
    }
}