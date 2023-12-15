namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to send templated emails
/// </summary>
public interface IEmailSender
{
    /// <summary>
    /// Send an email using a template
    /// </summary>
    /// <param name="recipients">Addresses of the recipients</param>
    /// <param name="templateName">Name of the email template</param>
    /// <param name="templateDataObject">Data for the email template</param>
    /// <returns>The messageId of the email</returns>
    Task<string> SendTemplateEmailAsync(List<string> recipients,
        string templateName, object templateDataObject);

    /// <summary>
    /// Send an email using a template
    /// </summary>
    /// <param name="recipient">Addresses of the recipient</param>
    /// <param name="templateName">Name of the email template</param>
    /// <param name="templateDataObject">Data for the email template</param>
    /// <returns>The messageId of the email</returns>
    Task<string> SendTemplateEmailAsync(string recipient,
        string templateName, object templateDataObject);
}
