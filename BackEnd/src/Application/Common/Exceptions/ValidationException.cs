using FluentValidation.Results;

namespace AutoLog.Application.Common.Exceptions;

public class ValidationException : Exception
{
    public ValidationException()
        : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, ValidationError?>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => new ValidationError { Code = e.ErrorCode, Message = e.ErrorMessage })
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.FirstOrDefault());

    }

    public IDictionary<string, ValidationError?> Errors { get; }
}

public class ValidationError
{
    public string Code { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}
