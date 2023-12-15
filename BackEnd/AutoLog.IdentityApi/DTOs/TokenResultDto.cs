namespace AutoLog.IdentityApi.DTOs;

/// <summary>
/// Token result returned to user
/// </summary>
public record TokenResultDto
{
    public string AccessToken { get; init; } = string.Empty;

    public int AccessTokenLifetime { get; init; }
}
