using System.Net;
using AutoLog.IdentityApi.Exceptions;

namespace AutoLog.IdentityApi.Middlewares;

public class GeneralExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GeneralExceptionMiddleware> _logger;

    public GeneralExceptionMiddleware(RequestDelegate next, ILogger<GeneralExceptionMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (VerificationException ex)
        {
            var message = new VerificationExceptionResponse
            {
                Status = (int)HttpStatusCode.Unauthorized,
                Code = ex.Code,
                Message = ex.Message,
                VerificationToken = ex.VerificationToken
            };
            await HandleExceptionAsync(new ExceptionDetails
            {
                Response = context.Response,
                LogLevel = LogLevel.Error,
                Exception = ex,
                StatusCode = HttpStatusCode.Unauthorized,
                ResponseToWrite = message
            });
        }
        catch (ActivationException ex)
        {
            var message = new ExceptionDetailsReason
            {
                Status = (int)HttpStatusCode.Unauthorized,
                Code = ex.Code,
                Message = ex.Message,
                Reason = ex.Reason
            };
            await HandleExceptionAsync(new ExceptionDetails
            {
                Response = context.Response,
                LogLevel = LogLevel.Error,
                Exception = ex,
                StatusCode = HttpStatusCode.Unauthorized,
                ResponseToWrite = message
            });
        }
        catch (Exception ex) when (ex is AuthenticationException)
        {
            var message = new ExceptionDetailsReason
            {
                Status = (int)HttpStatusCode.Unauthorized,
                Code = (ex.GetType().GetProperty("Code")!.GetValue(ex, null) as string)!,
                Message = ex.Message,
            };
            await HandleExceptionAsync(new ExceptionDetails
            {
                Response = context.Response,
                LogLevel = LogLevel.Error,
                Exception = ex,
                StatusCode = HttpStatusCode.Unauthorized,
                ResponseToWrite = message
            });
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(new ExceptionDetails
            {
                Response = context.Response,
                LogLevel = LogLevel.Error,
                Exception = ex,
                StatusCode = HttpStatusCode.InternalServerError,
                ResponseToWrite = ex.Message
            });
        }
    }

    private Task HandleExceptionAsync(ExceptionDetails exceptionDetails)
    {
        _logger.Log(exceptionDetails.LogLevel, exceptionDetails.Exception, exceptionDetails.Exception.Message);
        exceptionDetails.Response.StatusCode = (int)exceptionDetails.StatusCode;

        return exceptionDetails.ResponseToWrite != null ?
            exceptionDetails.Response.WriteAsJsonAsync(exceptionDetails.ResponseToWrite)
            : Task.CompletedTask;
    }
}
