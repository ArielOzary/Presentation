namespace AutoLog.Infrastructure.Configurations;

public sealed class AwsSesConfig
{
    public static string ConfigName => "AwsSes";

    public string EmailSender { get; set; } = string.Empty;

    public string AWSAccessKey { get; set; } = string.Empty;

    public string AWSSecretKey { get; set; } = string.Empty;

    public string AWSRegion { get; set; } = string.Empty;

    public string AWSSesServiceUrl { get; set; } = string.Empty;
}
