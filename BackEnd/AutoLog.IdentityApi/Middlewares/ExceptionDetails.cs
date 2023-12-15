using System.Net;

namespace AutoLog.IdentityApi.Middlewares;

public sealed class ExceptionDetails
{
    public HttpResponse Response { get; set; } = null!;

    public LogLevel LogLevel { get; set; }

    public Exception Exception { get; set; } = null!;

    public HttpStatusCode StatusCode { get; set; }

    public object? ResponseToWrite { get; set; }
}
