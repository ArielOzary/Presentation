namespace AutoLog.IdentityApi.Options;

/// <summary>
/// Options coming from appsettings.json
/// </summary>
public record JwtOptions
{
    public string Issuer { get; init; } = string.Empty;

    public string Key { get; init; } = string.Empty;

    public string Audience { get => Issuer; }

    public int TokenExpirationInSeconds { get; init; }

    public int RefreshTokenExpirationInSeconds { get; set; }

    public string RefreshTokenCookieName { get; set; } = string.Empty;
}
