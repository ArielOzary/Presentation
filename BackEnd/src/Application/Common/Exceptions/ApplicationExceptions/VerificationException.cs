namespace AutoLog.Application.Common.Exceptions.ApplicationExceptions;

public class VerificationException : AuthenticationException
{
    public string VerificationToken { get; set; } = string.Empty;

    public VerificationException(string message, string code) : base(message, code)
    {
    }

    public VerificationException(string message, string code, string verificationToken) : base(message, code)
    {
        VerificationToken = verificationToken;
    }
}
