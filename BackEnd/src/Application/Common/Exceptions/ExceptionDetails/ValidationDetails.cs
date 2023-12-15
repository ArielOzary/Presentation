namespace AutoLog.Application.Common.Exceptions.ExceptionDetails;

public class ValidationDetails : BaseExceptionDetails
{
    public IDictionary<string, ValidationError?> Errors { get; set; } = null!;
}
