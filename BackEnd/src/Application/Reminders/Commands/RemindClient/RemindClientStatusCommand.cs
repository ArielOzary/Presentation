using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.Reminder.RemindClient;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Reminders.Commands.RemindClient;

public sealed class RemindClientStatusCommand : IRequest
{
    public OpenStatusStage OpenStatusStage { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string ShipmentId { get; set; } = string.Empty;
}

public sealed class RemindClientStatusCommandHandler : IRequestHandler<RemindClientStatusCommand>
{
    private readonly IEmailService _emailService;
    private readonly IApplicationDbContext _context;

    public RemindClientStatusCommandHandler(
        IEmailService emailService,
        IApplicationDbContext applicationDbContext)
    {
        _emailService = emailService;
        _context = applicationDbContext;
    }

    public async Task<Unit> Handle(RemindClientStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Include(x => x.Company.Contacts)
            .FirstAsync(x => x.Id == request.UserId, cancellationToken);

        var shipment = await _context.Shipments
            .FirstAsync(x => x.Id == request.ShipmentId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        shipment.ReminderStatus = ReminderStatus.ClientReminder;
        await _context.SaveChangesAsync(cancellationToken);


        var emailData = ReminderEmailGenerator.GenerateClientDataForEmail(request.OpenStatusStage);
        if (emailData != null)
        {
            var emailDto = new RemindClientEmailDto
            {
                FirstName = user.Company.Contacts!
                    .First(x => x.ContactType == CompanyContactType.Basic).Name,
                Subject = emailData.Subject,
                ForwarderAction = emailData.ForwarderAction,
                Email = user.Email!,
                Locale = user.Locale,
                Reminder = emailData.Reminder,
            };

            await _emailService.SendReminderToClientAsync(emailDto);
        }
        return Unit.Value;
    }
}
