using AutoLog.Application.Common.Models;
using Microsoft.AspNetCore.Identity;

namespace AutoLog.Infrastructure.Identity;

/// <summary>
/// Extension for checking identity result
/// </summary>
public static class IdentityResultExtensions
{
    /// <summary>
    /// Method to check result on success state
    /// </summary>
    /// <param name="result">Result which will be converted to application result</param>
    /// <returns>Success or failure result</returns>
    public static Result ToApplicationResult(this IdentityResult result)
    {
        return result.Succeeded
            ? Result.Success()
            : Result.Failure(result.Errors);
    }
}
