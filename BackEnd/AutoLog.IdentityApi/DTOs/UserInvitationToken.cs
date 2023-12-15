namespace AutoLog.IdentityApi.DTOs;

/// <summary>
/// 
/// </summary>
public record UserInvitationToken
{
    public string Role { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;
}
