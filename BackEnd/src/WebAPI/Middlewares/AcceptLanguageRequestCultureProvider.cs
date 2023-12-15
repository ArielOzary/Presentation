using AutoLog.Application.Common.Constants;
using Microsoft.AspNetCore.Localization;

namespace WebAPI.Middlewares;

/// <summary>
/// Culture provider
/// </summary>
public class AcceptLanguageRequestCultureProvider : IRequestCultureProvider
{
#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
    public Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
    {
        var culture = Locales.English;

        httpContext.Request.Headers.TryGetValue("accept-language", out var locale);

        if (Locales.Supported.Any(x => x == locale))
        {
            culture = locale;
        }

        return Task.FromResult(new ProviderCultureResult(culture));
    }
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
}
