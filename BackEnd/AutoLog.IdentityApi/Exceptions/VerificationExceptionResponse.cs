namespace AutoLog.IdentityApi.Exceptions;
/// <summary>
/// Exception details with token 
/// </summary>
public class VerificationExceptionResponse : ExceptionDetails
{
    public string VerificationToken { get; init; } = string.Empty;
}
