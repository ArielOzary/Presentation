namespace AutoLog.Infrastructure.Configurations;

public class AwsS3Config
{
    public static string ConfigName => "AwsS3";

    public string BucketName { get; set; } = string.Empty;

    public string AWSS3ServiceUrl { get; set; } = string.Empty;
}
