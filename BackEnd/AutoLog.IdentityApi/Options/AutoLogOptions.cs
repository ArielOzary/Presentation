namespace AutoLog.IdentityApi.Options;

/// <summary>
/// Options coming from appsettings.json
/// </summary>
public record AutoLogOptions
{
    public bool UseInMemoryDatabase { get; init; }

    public ConnectionStringsOptions ConnectionStrings { get; init; } = null!;

    public JwtOptions Jwt { get; init; } = null!;

    public LoggingOptions Logging { get; init; } = null!;
}
