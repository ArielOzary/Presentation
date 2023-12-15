namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// Exception details
/// </summary>
public class ExceptionDetails
{
    public string Message { get; set; } = string.Empty;

    public int Status { get; set; }

    public string Code { get; set; } = string.Empty;
}
