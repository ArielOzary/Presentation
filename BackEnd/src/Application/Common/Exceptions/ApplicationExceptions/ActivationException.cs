namespace AutoLog.Application.Common.Exceptions.ApplicationExceptions;
public class ActivationException : AutoLogException
{
    public string? Reason { get; set; }

    public ActivationException(string message, string code, string? reason)
    : base(message, code)
    {
        Reason = reason;
    }
}
