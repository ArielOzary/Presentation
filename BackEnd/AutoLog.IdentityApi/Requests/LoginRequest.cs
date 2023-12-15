namespace AutoLog.IdentityApi.Requests;

/// <summary>
/// Request coming from user to login 
/// </summary>
public record LoginRequest
{
    public string Email { get; init; } = string.Empty;

    public string Password { get; init; } = string.Empty;
}
