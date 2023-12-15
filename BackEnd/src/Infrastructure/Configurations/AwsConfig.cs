namespace AutoLog.Infrastructure.Configurations;

public class AwsConfig
{
    public static string ConfigName => "Aws";

    public string AWSAccessKey { get; set; } = string.Empty;

    public string AWSSecretKey { get; set; } = string.Empty;

    public string AWSRegion { get; set; } = string.Empty;
}
