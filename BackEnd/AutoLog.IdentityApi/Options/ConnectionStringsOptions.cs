namespace AutoLog.IdentityApi.Options;

/// <summary>
/// Options coming from appsettings.json
/// </summary>
public record ConnectionStringsOptions
{
    public string DefaultConnection { get; init; } = string.Empty;
}
