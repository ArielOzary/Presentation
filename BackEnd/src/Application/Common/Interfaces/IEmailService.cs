using AutoLog.Application.Common.Dtos.Emails.AccountDeletionEmail;
using AutoLog.Application.Common.Dtos.Emails.AdminRegistrationInviteEmail;
using AutoLog.Application.Common.Dtos.Emails.AdminRegistrationSucceedEmail;
using AutoLog.Application.Common.Dtos.Emails.AvailableCustomQuotes;
using AutoLog.Application.Common.Dtos.Emails.ContactUs;
using AutoLog.Application.Common.Dtos.Emails.FreightForwarderInvitationEmail;
using AutoLog.Application.Common.Dtos.Emails.NewQuoteRequestEmail;
using AutoLog.Application.Common.Dtos.Emails.NoticeOfArrival;
using AutoLog.Application.Common.Dtos.Emails.QuoteRequestRecieved;
using AutoLog.Application.Common.Dtos.Emails.Reminder.RemindClient;
using AutoLog.Application.Common.Dtos.Emails.Reminder.RemindForwarder;
using AutoLog.Application.Common.Dtos.Emails.Shipments;
using AutoLog.Application.Common.Dtos.Emails.TemporaryRecoveryLinkEmail;
using AutoLog.Application.Common.Dtos.Emails.VerificationInformationEmail;
using AutoLog.Application.Common.Dtos.Emails.VerificationResultRejectedEmail;
using AutoLog.Application.Common.Dtos.Emails.VerificationResultSucceedEmail;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to send emails by templates
/// </summary>
public interface IEmailService
{
    Task SendAdminRegistrationInviteAsync(AdminRegistrationInviteEmailDto dto);

    Task SendFFRegistrationInviteAsync(FreightForwarderInvitationEmailDto dto);

    Task SendTemporaryRecoveryLinkEmailAsync(TemporaryRecoveryLinkEmailDto dto);

    Task SendVerificationInformationAsync(VerificationInformationEmailDto dto);

    Task SendVerificationResultRejectedAsync(VerificationResultRejectedEmailDto dto);

    Task SendVerificationResultSucceedAsync(VerificationResultSucceedEmailDto dto);

    Task SendRegistrationSucceedAsync(RegistrationSucceedEmailDto dto);

    Task SendAccountDeletionAsync(AccountDeletionEmailDto dto);

    Task SendNewQuoteRequestAsync(NewQuoteRequestEmailDto dto);

    Task SendQuoteRequestRecievedAsync(QuoteRequestRecievedEmailDto dto);

    Task SendAvailableCustomQuoteAsync(AvailableCustomQuoteEmailDto dto);

    Task SendDeleteShipmentAsync(DeleteShipmentEmailDto dto);

    Task SendCreateShipmentAsync(CreateShipmentEmailDto dto);

    Task SendContactUsAsync(ContactUsEmailDto dto);

    Task SendReminderToClientAsync(RemindClientEmailDto dto);

    Task SendReminderToForwarderAsync(RemindForwarderEmailDto dto);

    Task SendNoticeOfArrivalAsync(NoticeOfArrivalEmailDto dto);
}
