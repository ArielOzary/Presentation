namespace AutoLog.Application.Common.Exceptions.ApplicationExceptions;

public class AutoLogException : Exception
{
    public string Code { get; set; } = string.Empty;

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
