namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// Exception details with reason 
/// </summary>
public class ExceptionDetailsReason : ExceptionDetails
{
    public string Reason { get; set; } = string.Empty;
}
