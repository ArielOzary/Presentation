namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// Exception thrown in case of soft delete or user deactivation
/// </summary>
public sealed class ActivationException : AutoLogException
{
    public string? Reason { get; init; } = string.Empty;

    public ActivationException(string message, string? reason)
    : base(message)
    {
        Code = message;
        Reason = reason;
    }

    public ActivationException(string message, string code, string? reason)
        : base(message, code)
    {
        Reason = reason;
    }
}
