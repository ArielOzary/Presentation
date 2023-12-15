using AutoLog.Application.Common.Dtos.Emails.Reminder.RemindForwarder;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service reminding freight forwarders about shipment status steps
/// </summary>
public sealed class ReminderService : IReminderService
{
    private readonly IEmailService _emailService;
    private readonly IApplicationDbContext _context;

    public ReminderService(IApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    /// <summary>
    /// Method which remings freight forwarder
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task RemindAsync(CancellationToken cancellationToken)
    {
        var freightForwarders = await _context.Users
            .Include(x => x.ReminderEmail)
            .Where(x => x.ReminderEmail != null)
            .ToListAsync(cancellationToken);

        foreach (var freightForwarder in freightForwarders)
        {
            if (freightForwarder.ReminderEmail!.DateToRemind >= DateTime.UtcNow)
                continue;

            await NotifyFreightForwarderAsync(freightForwarder.ReminderEmail!);

            var shipment = await _context.Shipments
                .FirstAsync(x => x.Id == freightForwarder.ReminderEmail.ShipmentId, cancellationToken);

            shipment.ReminderStatus = ReminderStatus.FFReminder;
            freightForwarder.ReminderEmail = null;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Method to notify freight forwarder by template
    /// </summary>
    /// <param name="reminderEmail">Email to send</param>
    /// <returns>Task</returns>
    private async Task NotifyFreightForwarderAsync(ReminderEmail reminderEmail)
    {
        var emailDto = new RemindForwarderEmailDto
        {
            Subject = reminderEmail.Subject,
            ForwarderName = reminderEmail.ForwarderName,
            ClientFirstName = reminderEmail.ClientFirstName,
            ShipmentId = reminderEmail.ShipmentId,
            LatestUpdate = reminderEmail.LatestUpdate,
            Email = reminderEmail.Email,
            Locale = reminderEmail.Locale,
        };

        await _emailService.SendReminderToForwarderAsync(emailDto);
    }
}
