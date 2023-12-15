namespace AutoLog.Application.Common.Exceptions.ExceptionDetails;

public class VerificationDetails : ExceptionDetails
{
    public string VerificationToken { get; set; } = string.Empty;
}
