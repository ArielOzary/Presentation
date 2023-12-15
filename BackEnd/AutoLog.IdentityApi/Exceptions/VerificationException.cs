namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// Exception thrown in case of verification errors
/// </summary>
public sealed class VerificationException : AuthenticationException
{
    public string VerificationToken { get; init; } = string.Empty;

    public VerificationException(string message, string code, string verificationToken) : base(message, code)
    {
        VerificationToken = verificationToken;
    }

    public VerificationException(string message, string verificationToken) : base(message)
    {
        VerificationToken = verificationToken;
    }
}
