using Microsoft.AspNetCore.OutputCaching;

namespace WebAPI.CachesPolicies;

/// <summary>
/// Custom cache policy
/// </summary>
public class OutputCacheWithAuthPolicy : IOutputCachePolicy
{
    public OutputCacheWithAuthPolicy() { }

    /// <summary>
    /// Method which caches request with auth header
    /// </summary>
    /// <param name="context">Output cache context</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>ValueTask</returns>
    ValueTask IOutputCachePolicy.CacheRequestAsync(OutputCacheContext context, CancellationToken cancellationToken)
    {
        var attemptOutputCaching = AttemptOutputCaching(context);
        context.EnableOutputCaching = true;
        context.AllowCacheLookup = attemptOutputCaching;
        context.AllowCacheStorage = attemptOutputCaching;
        context.AllowLocking = true;

        context.CacheVaryByRules.QueryKeys = "*";
        return ValueTask.CompletedTask;
    }

    /// <summary>
    /// Attempt to cache
    /// </summary>
    /// <param name="context">Output cache context</param>
    /// <returns>True if method from request is get or head</returns>
    private static bool AttemptOutputCaching(OutputCacheContext context)
    {
        var request = context.HttpContext.Request;

        return HttpMethods.IsGet(request.Method) || HttpMethods.IsHead(request.Method);
    }

    public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken cancellation) => ValueTask.CompletedTask;

    public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken cancellation) => ValueTask.CompletedTask;
}