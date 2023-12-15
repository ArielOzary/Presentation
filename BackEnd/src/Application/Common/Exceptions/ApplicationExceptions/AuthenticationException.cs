namespace AutoLog.Application.Common.Exceptions.ApplicationExceptions;

public class AuthenticationException : Exception
{
    public string Code { get; set; } = string.Empty;

    public AuthenticationException(string message) : base(message)
    {
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
