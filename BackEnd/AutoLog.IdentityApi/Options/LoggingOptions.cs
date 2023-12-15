namespace AutoLog.IdentityApi.Options;

/// <summary>
/// Options coming from appsettings.json
/// </summary>
public record LoggingOptions
{
    public string MinimumLogLevel { get; init; } = string.Empty;

    public string Microsoft { get; init; } = string.Empty;

    public string System { get; init; } = string.Empty;

    public string MicrosoftAspNetCoreAuthentication { get; init; } = string.Empty;

    public string MicrosoftAspNetCoreAuthenticationJwtBearerJwtBearerHandler { get; init; } = string.Empty;
}
