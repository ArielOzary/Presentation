namespace AutoLog.Infrastructure.Configurations;

public sealed class AutoLogConfig
{
    public static string ConfigName => "AutoLog";

    public bool UseInMemoryDatabase { get; set; }

    public ConnectionStringsConfig ConnectionStrings { get; set; } = null!;

    public JwtConfig Jwt { get; set; } = null!;

    public LoggingConfig Logging { get; set; } = null!;
}
