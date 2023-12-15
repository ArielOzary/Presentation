using System.Globalization;
using AutoLog.Application.Common.Constants;
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
using AutoLog.Application.Common.Interfaces;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service to send emails by templates
/// </summary>
public sealed class EmailService : IEmailService
{
    private readonly IEmailSender _emailSender;

    public EmailService(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public async Task SendAdminRegistrationInviteAsync(AdminRegistrationInviteEmailDto dto)
    {
        var emailTemplate = EmailTemplates.AdminInvitationEmail;

        var data = new AdminRegistrationInviteEmailDataDto
        {
            Sub = dto.Token
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendFFRegistrationInviteAsync(FreightForwarderInvitationEmailDto dto)
    {
        var emailTemplate = EmailTemplates.FreightForwarderInvitation;

        var data = new AdminRegistrationInviteEmailDataDto
        {
            Sub = dto.Token
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendTemporaryRecoveryLinkEmailAsync(TemporaryRecoveryLinkEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.TemporaryRecoveryLink);

        var data = new TemporaryRecoveryLinkEmailDataDto
        {
            Sub = dto.Token,
            FirstName = dto.FirstName,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendVerificationInformationAsync(VerificationInformationEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.VerificationInformation);

        var data = new VerificationInformationEmailDataDto
        {
            Sub = dto.Token,
            FirstName = dto.FirstName,
            CompanyName = dto.CompanyName,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendVerificationResultRejectedAsync(VerificationResultRejectedEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.VerificationResultRejected);

        var data = new VerificationResultRejectedEmailDataDto
        {
            Sub = dto.Token,
            FirstName = dto.FirstName,
            CompanyName = dto.CompanyName,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendVerificationResultSucceedAsync(VerificationResultSucceedEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.VerificationResultSucceed);

        var data = new VerificationResultSucceedEmailDataDto
        {
            FirstName = dto.FirstName,
            CompanyName = dto.CompanyName,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendRegistrationSucceedAsync(RegistrationSucceedEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.RegistrationSucceed);

        var data = new RegistrationSucceedEmailDataDto
        {
            Password = dto.Password,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendAccountDeletionAsync(AccountDeletionEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.AccountDeletion);

        var data = new AccountDeletionEmailDataDto
        {
            FirstName = dto.CompanyContactName,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendNewQuoteRequestAsync(NewQuoteRequestEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.NewQuoteRequest, dto.Locale);

        var data = new NewQuoteRequestEmailDataDto
        {
            ForwarderFirstName = dto.FreightForwarderName ?? string.Empty,
            ClientFirstName = dto.ClientName ?? string.Empty,
            QuoteId = dto.QuoteId.ToString(),
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendQuoteRequestRecievedAsync(QuoteRequestRecievedEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.QuoteRequestRecieved);

        var data = new QuoteRequestRecievedEmailDataDto
        {
            FirstName = dto.ClientName
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendAvailableCustomQuoteAsync(AvailableCustomQuoteEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.AvailableRatesForQuoteToClient, dto.Locale);

        var data = new AvailableCustomQuoteEmailDataDto
        {
            QUOTE_ID = dto.QUOTE_ID.ToString(),
            RateOptions = dto.RateOptions,
            FirstName = dto.FirstName
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }
    public async Task SendContactUsAsync(ContactUsEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.ContactUs, dto.Locale);

        var data = new ContactUsEmailDataDto
        {
            FirstName = dto.FirstName,
            CompanyName = dto.CompanyName,
            Email = dto.EmailAddress,
            Phone = dto.Phone,
            Message = dto.Message,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendNoticeOfArrivalAsync(NoticeOfArrivalEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.NoticeOfArrival, dto.Locale);

        var data = new NoticeOfArrivalEmailDataDto
        {
            ShipmentName = dto.ShipmentName,
            ClientsName = dto.ClientsName,
            ArrivalDate = dto.ArrivalDate,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendReminderToClientAsync(RemindClientEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.RemindClient, dto.Locale);

        var data = new RemindClientEmailDataDto
        {
            FirstName = dto.FirstName,
            ForwarderAction = dto.ForwarderAction,
            Subject = dto.Subject,
            Reminder = dto.Reminder,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendReminderToForwarderAsync(RemindForwarderEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.RemindForwarder, dto.Locale);

        var data = new RemindForwarderEmailDataDto
        {
            ShipmentId = dto.ShipmentId,
            Subject = dto.Subject,
            ClientFirstName = dto.ClientFirstName,
            ForwarderName = dto.ForwarderName,
            LatestUpdate = dto.LatestUpdate,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendDeleteShipmentAsync(DeleteShipmentEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.ShipmentDeletionNotificationToClient, dto.Locale);

        var data = new DeleteShipmentEmailDataDto
        {
            ReasonForDeletion = dto.Reason,
            SHIPMENT_ID = dto.ShipmentId.ToString(),
            ShipmentName = dto.ShipmentName,
            FirstName = dto.ClientName,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    public async Task SendCreateShipmentAsync(CreateShipmentEmailDto dto)
    {
        var emailTemplate = GetEmailTemplateName(EmailTemplates.RequestToOpenShipmentFreightForwarder, dto.Locale);

        var data = new CreateShipmentEmailDataDto
        {
            FirstName = dto.FirstName,
            ShipmentName = dto.ShipmentName,
            CompanyName = dto.CompanyName,
            UserName = dto.UserName,
            QuoteId = dto.QuoteId.ToString(),
            RateId = dto.RateId.ToString(),
            SupplierName = dto.SupplierName,
            SupplierContactPhone = dto.SupplierContactPhone,
            SupplierContactEmail = dto.SupplierContactEmail,
            SupplierAddress = dto.SupplierAddress,
            SupplierApartment = dto.SupplierApartment,
            SupplierPostalCode = dto.SupplierPostalCode,
            Origin = dto.Origin,
            Destination = dto.Destination,
        };

        await _emailSender.SendTemplateEmailAsync(dto.Email, emailTemplate, data);
    }

    private static string GetEmailTemplateName(string emailTemplate)
    {
        return emailTemplate + CultureInfo.CurrentUICulture;
    }

    private static string GetEmailTemplateName(string emailTemplate, string locale)
    {
        return emailTemplate + locale;
    }
}
