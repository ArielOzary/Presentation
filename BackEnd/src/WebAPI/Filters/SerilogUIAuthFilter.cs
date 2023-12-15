using System.Web;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Serilog.Ui.Web.Authorization;

namespace WebAPI.Filters;

/// <summary>
/// Serilog UI authentication filter only for admins
/// </summary>
[System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "<Pending>")]
public class SerilogUIAuthFilter : IUiAuthorizationFilter
{
    private readonly IServiceProvider _services;

    public SerilogUIAuthFilter(IServiceProvider services)
    {
        _services = services;
    }

    /// <summary>
    /// Method which is invoked when user is trying to access serilog ui
    /// </summary>
    /// <param name="httpContext">HTTP context</param>
    /// <returns>True in case that user is authorized</returns>
    public bool Authorize(HttpContext httpContext)
    {
        if (httpContext.Request.Query.TryGetValue("logs-token", out var logsToken))
        {
            return Authenticate(logsToken, httpContext);
        }
        if (httpContext.Request.Headers.TryGetValue("Referer", out var redirect))
        {
            var redirectUri = new Uri(redirect!);
            var redirectToken = HttpUtility.ParseQueryString(redirectUri.Query).Get("logs-token");

            return Authenticate(redirectToken, httpContext);
        }

        return false;
    }

    /// <summary>
    /// Method to authenticate admin by temporary token for serilog ui
    /// </summary>
    /// <param name="logsToken">Token to access serilog ui, expriration is set in appsettings</param>
    /// <param name="httpContext">HTTP context</param>
    /// <returns>True in case that user is authenticated</returns>
    private bool Authenticate(string? logsToken, HttpContext httpContext)
    {
        if (string.IsNullOrEmpty(logsToken))
            return false;

        using var scope = _services.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var jwtProvider = scope.ServiceProvider.GetRequiredService<IJwtProvider>();

        if (jwtProvider.ValidateLogsToken(logsToken))
        {
            var userId = jwtProvider.GetIdFromToken(logsToken);

            var user = userManager.FindByIdAsync(userId).Result;

            if (user is not null)
                return SetRequestHeader(httpContext, jwtProvider, user);
        }

        return false;
    }

    /// <summary>
    /// Method to add auth header to serilog UI
    /// </summary>
    /// <param name="httpContext">HTTP context</param>
    /// <param name="jwtProvider">JWT provider to generate bearer token</param>
    /// <param name="user">User to give access to</param>
    /// <returns>True</returns>
    private static bool SetRequestHeader(HttpContext httpContext, IJwtProvider jwtProvider, ApplicationUser user)
    {
        var jwt = jwtProvider.GenerateAsync(user).Result;
        httpContext.Request.Headers.Authorization = new Microsoft.Extensions.Primitives.StringValues($"Bearer {jwt.AccessToken}");
        return true;
    }
}
