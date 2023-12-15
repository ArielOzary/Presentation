using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoLog.IdentityApi.DAL.Entities;
using AutoLog.IdentityApi.DTOs;
using AutoLog.IdentityApi.Exceptions;
using AutoLog.IdentityApi.Options;
using AutoLog.IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AutoLog.Infrastructure.Identity;

/// <summary>
/// Custom claims
/// </summary>
public static class CustomClaims
{
    public const string ROLE_CLAIM = "role";

    public const string COMPANY_ID_CLAIM = "companyId";
}

/// <summary>
/// Provider for generating tokens and validating them
/// </summary>
public class JwtProvider : IJwtProvider
{
    private readonly AutoLogOptions _autoLogOptions;

    private readonly UserManager<ApplicationUser> _userManager;

    private readonly IHttpContextAccessor _httpContextAccessor;

    private readonly JwtSecurityTokenHandler _tokenHandler;

    public JwtProvider(IOptions<AutoLogOptions> autoLogOptions,
        UserManager<ApplicationUser> userManager,
        IHttpContextAccessor httpContextAccessor)
    {
        _autoLogOptions = autoLogOptions.Value;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    /// <summary>
    /// Generate authorization token and refresh tokens for user
    /// </summary>
    /// <param name="user">User who want to authorize</param>
    /// <returns>Auth token and refresh token as result</returns>
    public async Task<TokenResultDto> GenerateAsync(ApplicationUser user)
    {
        var tokenValue = GenerateToken(await GetClaimsAsync(user), _autoLogOptions.Jwt.TokenExpirationInSeconds);

        GenerateRefreshToken(user);

        return new TokenResultDto
        {
            AccessToken = tokenValue,
            AccessTokenLifetime = _autoLogOptions.Jwt.TokenExpirationInSeconds,
        };
    }

    /// <summary>
    /// Method to refresh access token from coockies
    /// </summary>
    /// <returns>Auth token and refresh token as result</returns>
    /// <exception cref="AuthenticationException">Exception thrown if user was not found or token is invalid</exception>
    /// <exception cref="ActivationException">Exception thrown if user is deleted or deactivated</exception>
    public async Task<TokenResultDto> RefreshAccessTokenAsync()
    {
        var refreshToken = _httpContextAccessor.HttpContext!.Request.Cookies[_autoLogOptions.Jwt.RefreshTokenCookieName];
        var refreshUserId = GetIdFromToken(refreshToken);
        var user = await _userManager.Users
            .AsNoTracking()
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(user => user.Id == refreshUserId)
            ?? throw new AuthenticationException(ErrorCodes.REFRESH_ACCESS_TOKEN_FAILED);

        if (user.IsDeleted)
            throw new ActivationException(ErrorCodes.USER_IS_DELETED, user.DeactivationReason!);
        if (user.IsDeactivated)
            throw new ActivationException(ErrorCodes.USER_IS_DEACTIVATED, user.DeactivationReason!);

        if (!ValidateRefreshToken(refreshToken))
            throw new AuthenticationException(ErrorCodes.REFRESH_ACCESS_TOKEN_FAILED);

        var token = await GenerateAsync(user);

        return token;
    }

    /// <summary>
    /// Receiving claims for user
    /// </summary>
    /// <param name="user">User to generate claims for</param>
    /// <returns>List of claims with users data</returns>
    private async Task<IEnumerable<Claim>> GetClaimsAsync(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
        };

        var roles = await _userManager.GetRolesAsync(user);

        claims.AddRange(roles.Select(x => new Claim(CustomClaims.ROLE_CLAIM, x)));

        var company = await _userManager.Users.Include(x => x.Company).Where(x => x.Id == user.Id).Select(x => x.Company).FirstOrDefaultAsync();

        claims.Add(new Claim(CustomClaims.COMPANY_ID_CLAIM, company == default ? string.Empty : company.Id.ToString()));

        return claims;
    }

    /// <summary>
    /// Method to generate refresh token which will be stored in cache
    /// </summary>
    /// <param name="user">User for which refresh token should be generated</param>
    private void GenerateRefreshToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
        };

        var refreshToken = GenerateToken(claims, _autoLogOptions.Jwt.RefreshTokenExpirationInSeconds);

        var cookieOptions = new CookieOptions
        {
            Secure = true,
            SameSite = SameSiteMode.None,
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddSeconds(_autoLogOptions.Jwt.RefreshTokenExpirationInSeconds)
        };

        _httpContextAccessor.HttpContext!.Response.Cookies.Append(_autoLogOptions.Jwt.RefreshTokenCookieName, refreshToken, cookieOptions);
    }

    /// <summary>
    /// Method which generates token by list of claims and with given expiration time
    /// </summary>
    /// <param name="claims">List of claims</param>
    /// <param name="tokenExpiration">Expire time</param>
    /// <returns>Token by given parameters</returns>
    private string GenerateToken(IEnumerable<Claim> claims, int tokenExpiration)
    {
        var signingCredentials = new SigningCredentials(
            key: new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_autoLogOptions.Jwt.Key)),
            algorithm: SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _autoLogOptions.Jwt.Issuer,
            audience: _autoLogOptions.Jwt.Audience,
            claims,
            null,
            DateTime.UtcNow.AddSeconds(tokenExpiration),
            signingCredentials);

        var tokenValue = _tokenHandler.WriteToken(token);

        return tokenValue;
    }

    /// <summary>
    /// Method to get id from token
    /// </summary>
    /// <param name="token">Token to get id from</param>
    /// <returns>User id</returns>
    private string GetIdFromToken(string? token)
    {
        var exception = new AuthenticationException(ErrorCodes.REFRESH_ACCESS_TOKEN_FAILED);

        if (string.IsNullOrEmpty(token))
            throw exception;

        var id = _tokenHandler.ReadJwtToken(token).Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)
            ?? throw exception;

        return id.Value;
    }

    /// <summary>
    /// Method to validate refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token</param>
    /// <returns>True in case of success validation</returns>
    /// <exception cref="AuthenticationException">Exception thrown in case of empty or null token</exception>
    private bool ValidateRefreshToken(string? refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
            throw new AuthenticationException(ErrorCodes.REFRESH_ACCESS_TOKEN_FAILED);

        var validationParameters = new TokenValidationParameters
        {
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_autoLogOptions.Jwt.Key)),
            ValidateIssuer = true,
            ValidIssuer = _autoLogOptions.Jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = _autoLogOptions.Jwt.Audience
        };

        try
        {
            var principal = _tokenHandler.ValidateToken(refreshToken, validationParameters, out var validatedToken);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
