using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service to send templated emails
/// </summary>
public sealed class EmailSender : IEmailSender
{
    private readonly IAmazonSimpleEmailService _amazonSimpleEmailService;
    private readonly AwsSesConfig _awsSesConfig;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IAmazonSimpleEmailService amazonSimpleEmailService, AwsSesConfig awsSesConfig, ILogger<EmailSender> logger)
    {
        _amazonSimpleEmailService = amazonSimpleEmailService;
        _awsSesConfig = awsSesConfig;
        _logger = logger;
    }

    /// <summary>
    /// Send an email using a template
    /// </summary>
    /// <param name="recipients">Addresses of the recipients</param>
    /// <param name="templateName">Name of the email template</param>
    /// <param name="templateDataObject">Data for the email template</param>
    /// <returns>The messageId of the email</returns>
    public async Task<string> SendTemplateEmailAsync(List<string> recipients,
        string templateName, object templateDataObject)
    {
        var messageId = string.Empty;
        try
        {
            // Template data should be serialized JSON from either a class or a dynamic object.
            var templateData = JsonConvert.SerializeObject(templateDataObject, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });

            messageId = await SendEmailsAsync(templateName, templateData, recipients);
        }
        catch (Exception ex)
        {
            _logger.LogError("SendTemplateEmailAsync failed with exception: {Message}", ex.Message);
        }

        return messageId;
    }

    /// <summary>
    /// Send an email using a template
    /// </summary>
    /// <param name="recipient">Addresses of the recipient</param>
    /// <param name="templateName">Name of the email template</param>
    /// <param name="templateDataObject">Data for the email template</param>
    /// <returns>The messageId of the email</returns>
    public async Task<string> SendTemplateEmailAsync(string recipient,
        string templateName, object templateDataObject)
    {
        var messageId = string.Empty;
        try
        {
            // Template data should be serialized JSON from either a class or a dynamic object.
            var templateData = JsonConvert.SerializeObject(templateDataObject, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });

            messageId = await SendEmailsAsync(templateName, templateData, new List<string> { recipient });
        }
        catch (Exception ex)
        {
            _logger.LogError("SendTemplateEmailAsync failed with exception: {Message}", ex.Message);
        }

        return messageId;
    }

    /// <summary>
    /// Method to send an email
    /// </summary>
    /// <param name="templateName">Email template</param>
    /// <param name="templateData">Email data</param>
    /// <param name="toAdresses">Address to send to</param>
    /// <returns>Message id</returns>
    private async Task<string> SendEmailsAsync(string templateName, string templateData, List<string> toAdresses)
    {
        var response = await _amazonSimpleEmailService.SendTemplatedEmailAsync(
            new SendTemplatedEmailRequest
            {
                Source = _awsSesConfig.EmailSender,
                Destination = new Destination
                {
                    ToAddresses = toAdresses
                },
                Template = templateName,
                TemplateData = templateData
            });

        return response.MessageId;
    }
}
