namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// Exception thrown in case of authentication failure
/// </summary>
public class AuthenticationException : Exception
{
    public string Code { get; init; } = string.Empty;

    public AuthenticationException(string message) : base(message)
    {
        Code = message;
    }

    public AuthenticationException(string message, Exception innerException) : base(message, innerException)
    {
    }

    public AuthenticationException(string message, string code)
        : base(message)
    {
        Code = code;
    }
}
