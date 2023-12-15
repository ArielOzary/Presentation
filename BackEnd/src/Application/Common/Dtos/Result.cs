using Microsoft.AspNetCore.Identity;

namespace AutoLog.Application.Common.Models;

public class Result
{
    internal Result(bool succeeded, IEnumerable<IdentityError> errors)
    {
        Succeeded = succeeded;
        Errors = errors.ToArray();
    }

    public bool Succeeded { get; set; }

    public IdentityError[] Errors { get; set; }

    public static Result Success()
    {
        return new Result(true, Array.Empty<IdentityError>());
    }

    public static Result Failure(IEnumerable<IdentityError> errors)
    {
        return new Result(false, errors);
    }
}
