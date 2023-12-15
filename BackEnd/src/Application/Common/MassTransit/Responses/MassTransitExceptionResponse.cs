using MassTransit;

namespace AutoLog.Application.Common.MassTransit.Responses;

[MessageUrn(Constants.MassTransitTypes.MassTransitExceptionResponseTypes.Type)]
public class MassTransitExceptionResponse
{
    public string Message { get; set; } = string.Empty;

    public string? StackTrace { get; set; }
}
