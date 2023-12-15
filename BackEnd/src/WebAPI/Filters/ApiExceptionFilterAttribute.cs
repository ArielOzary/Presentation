using AutoLog.Application.Common.Exceptions;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Exceptions.ExceptionDetails;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AutoLog.WebAPI.Filters;

/// <summary>
/// Exceptions filter attribute to handle different types of exceptions
/// </summary>
public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
{
    private readonly IDictionary<Type, Action<ExceptionContext>> _exceptionHandlers;

    public ApiExceptionFilterAttribute()
    {
        // Register known exception types and handlers.
        _exceptionHandlers = new Dictionary<Type, Action<ExceptionContext>>
            {
                { typeof(ValidationException), HandleValidationException },
                { typeof(NotFoundException), HandleNotFoundException },
                { typeof(UnauthorizedAccessException), HandleUnauthorizedAccessException },
                { typeof(ForbiddenAccessException), HandleForbiddenAccessException },
                { typeof(AutoLogException), HandleAutoLogException },
                { typeof(VerificationException), HandleVerificationException },
                { typeof(ActivationException), HandleActivationException },
                { typeof(AuthenticationException), HandleAuthenticationException },
            };
    }

    /// <summary>
    /// Method invoked in case of catching exception
    /// </summary>
    /// <param name="context">Exception context</param>
    public override void OnException(ExceptionContext context)
    {
        HandleException(context);

        base.OnException(context);
    }

    /// <summary>
    /// Handling exception
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleException(ExceptionContext context)
    {
        var type = context.Exception.GetType();

        // Invoking proper handling depending on type of exception
        if (_exceptionHandlers.TryGetValue(type, out var exceptionHandler))
        {
            exceptionHandler.Invoke(context);
            return;
        }
    }

    /// <summary>
    /// Handling validation exception which will return 400 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleValidationException(ExceptionContext context)
    {
        var exception = (ValidationException)context.Exception;

        var details = new ValidationDetails()
        {
            Message = exception.Message,
            Status = StatusCodes.Status400BadRequest,
            Errors = exception.Errors,
        };

        context.Result = new BadRequestObjectResult(details);

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not found exception which will return 404 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleNotFoundException(ExceptionContext context)
    {
        var exception = (NotFoundException)context.Exception;

        var details = new ProblemDetails()
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
            Title = "The specified resource was not found.",
            Detail = exception.Message
        };

        context.Result = new NotFoundObjectResult(details);

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not unauthorized exception which will return 401 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleUnauthorizedAccessException(ExceptionContext context)
    {
        var details = new ProblemDetails
        {
            Status = StatusCodes.Status401Unauthorized,
            Title = "Unauthorized",
            Type = "https://tools.ietf.org/html/rfc7235#section-3.1"
        };

        context.Result = new ObjectResult(details)
        {
            StatusCode = StatusCodes.Status401Unauthorized
        };

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not forbidden access exception which will return 403 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleForbiddenAccessException(ExceptionContext context)
    {
        var details = new ProblemDetails
        {
            Status = StatusCodes.Status403Forbidden,
            Title = "Forbidden",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3"
        };

        context.Result = new ObjectResult(details)
        {
            StatusCode = StatusCodes.Status403Forbidden
        };

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not autolog exception which will return 400 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleAutoLogException(ExceptionContext context)
    {
        var exception = (AutoLogException)context.Exception;

        var details = new ExceptionDetails()
        {
            Message = exception.Message,
            Status = StatusCodes.Status400BadRequest,
            Code = exception.Code,
        };

        context.Result = new BadRequestObjectResult(details);

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not authentication exception which will return 401 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleAuthenticationException(ExceptionContext context)
    {
        var exception = (AuthenticationException)context.Exception;

        var details = new ExceptionDetails()
        {
            Message = exception.Message,
            Status = StatusCodes.Status401Unauthorized,
            Code = exception.Code,
        };

        context.Result = new ObjectResult(details)
        {
            StatusCode = details.Status
        };

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not verification exception which will return 401 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleVerificationException(ExceptionContext context)
    {
        var exception = (VerificationException)context.Exception;

        var details = new VerificationDetails()
        {
            Message = exception.Message,
            Status = StatusCodes.Status401Unauthorized,
            Code = exception.Code,
            VerificationToken = exception.VerificationToken,
        };

        context.Result = new ObjectResult(details)
        {
            StatusCode = details.Status
        };

        context.ExceptionHandled = true;
    }

    /// <summary>
    /// Handling not activation exception which will return 404 status from action
    /// </summary>
    /// <param name="context">Exception context</param>
    private void HandleActivationException(ExceptionContext context)
    {
        var exception = (ActivationException)context.Exception;

        var details = new ActivationDetails()
        {
            Message = exception.Message,
            Status = StatusCodes.Status401Unauthorized,
            Code = exception.Code,
            Reason = exception.Reason,
        };

        context.Result = new ObjectResult(details)
        {
            StatusCode = details.Status
        };

        context.ExceptionHandled = true;
    }
}
