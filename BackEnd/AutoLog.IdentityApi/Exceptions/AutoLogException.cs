namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// Exception thrown in cases of logic errors
/// </summary>
public class AutoLogException : Exception
{
    public string Code { get; init; } = string.Empty;

    public AutoLogException()
    {
    }

    public AutoLogException(string message)
        : base(message)
    {
        Code = message;
    }

    public AutoLogException(string message, string code)
        : base(message)
    {
        Code = code;
    }

    public AutoLogException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}