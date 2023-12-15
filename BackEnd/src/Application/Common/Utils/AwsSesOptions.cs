namespace AutoLog.Application.Common.Utils;

public sealed class AwsSesOptions
{
    public string EmailSender { get; set; } = string.Empty;

    public string AWSSesServiceUrl { get; set; } = string.Empty;

    public string ContactUsEmail { get; set; } = string.Empty;
}
