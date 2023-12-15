using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Configurations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AutoLog.Infrastructure.Identity;

/// <summary>
/// Jwt provider for logic with tokens
/// </summary>
public class JwtProvider : IJwtProvider
{
    private readonly AutoLogConfig _autoLogConfig;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly ICurrentUserService _currentUserService;

    public JwtProvider(
        AutoLogConfig autoLogConfig,
        UserManager<ApplicationUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        ICurrentUserService currentUserService)
    {
        _autoLogConfig = autoLogConfig;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _tokenHandler = new JwtSecurityTokenHandler();
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Method to generate token
    /// </summary>
    /// <param name="user">User for who token will be generated</param>
    /// <returns>Generated access and refresh tokens</returns>
    public async Task<TokenResultDto> GenerateAsync(ApplicationUser user)
    {
        var tokenValue = GenerateToken(
            await GetClaimsAsync(user),
            _autoLogConfig.Jwt.TokenExpirationInSeconds,
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_autoLogConfig.Jwt.TokenKey)));

        GenerateRefreshToken(user);

        return new TokenResultDto
        {
            AccessToken = tokenValue,
            AccessTokenLifetime = _autoLogConfig.Jwt.TokenExpirationInSeconds,
        };
    }

    /// <summary>
    /// Generate token for serilog ui
    /// </summary>
    /// <returns>Token for serilog ui</returns>
    public async Task<string> GenerateLogsTokenAsync()
    {
        var user = await GetUserWithValidationAsync(_currentUserService.UserId!);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
        };

        var token = GenerateToken(
            claims,
            _autoLogConfig.Jwt.LogsTokenExpirationInSeconds,
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_autoLogConfig.Jwt.LogsKey)));

        return token;
    }

    /// <summary>
    /// Method to validate logs token
    /// </summary>
    /// <param name="logsToken">Token for serilog ui</param>
    /// <returns>True in case of success validation</returns>
    /// <exception cref="AuthenticationException">Exception thrown in case of null or empty token</exception>
    public bool ValidateLogsToken(string? logsToken)
    {
        if (string.IsNullOrEmpty(logsToken))
            throw new AuthenticationException(ErrorCodes.LOGS_ACCESS_TOKEN_FAILED, ErrorCodes.LOGS_ACCESS_TOKEN_FAILED);

        var validationParameters = CreateValidationParameters(_autoLogConfig.Jwt.LogsKey);

        return ValidateToken(logsToken, validationParameters);
    }

    /// <summary>
    /// Method to validate token
    /// </summary>
    /// <param name="token">Token</param>
    /// <param name="validationParameters">Validation parameters</param>
    /// <returns>True in case of success validation</returns>
    private bool ValidateToken(string? token, TokenValidationParameters validationParameters)
    {
        try
        {
            var principal = _tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    /// <summary>
    /// Method to receive claims for given user
    /// </summary>
    /// <param name="user">User</param>
    /// <returns>List of claims with user`s data inside</returns>
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
    /// Method to generate refresh token and save it in coockies
    /// </summary>
    /// <param name="user">User</param>
    private void GenerateRefreshToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
        };

        var refreshToken = GenerateToken(
            claims,
            _autoLogConfig.Jwt.RefreshTokenExpirationInSeconds,
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_autoLogConfig.Jwt.TokenKey)));

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddSeconds(_autoLogConfig.Jwt.RefreshTokenExpirationInSeconds)
        };

        _httpContextAccessor.HttpContext!.Response.Cookies.Append(_autoLogConfig.Jwt.RefreshTokenCookieName, refreshToken, cookieOptions);
    }

    /// <summary>
    /// Method to generate token by given claims, token expiration time and key
    /// </summary>
    /// <param name="claims">List of claims</param>
    /// <param name="tokenExpiration">Expire time</param>
    /// <param name="key">SymmetricSecurityKey</param>
    /// <returns>Generated token by given parameters</returns>
    private string GenerateToken(IEnumerable<Claim> claims, int tokenExpiration, SymmetricSecurityKey key)
    {
        var signingCredentials = new SigningCredentials(
            key: key,
            algorithm: SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _autoLogConfig.Jwt.Issuer,
            audience: _autoLogConfig.Jwt.Audience,
            claims,
            null,
            DateTime.UtcNow.AddSeconds(tokenExpiration),
            signingCredentials);

        var tokenValue = _tokenHandler.WriteToken(token);

        return tokenValue;
    }

    /// <summary>
    /// Method to receive user id from token
    /// </summary>
    /// <param name="token">Token</param>
    /// <returns>User id</returns>
    public string GetIdFromToken(string? token)
    {
        var exception = new AuthenticationException(ErrorCodes.USER_NOT_FOUND, ErrorCodes.USER_NOT_FOUND);

        if (string.IsNullOrEmpty(token))
            throw exception;

        var id = _tokenHandler.ReadJwtToken(token).Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)
            ?? throw exception;

        return id.Value;
    }

    /// <summary>
    /// Method to create validation parameters
    /// </summary>
    /// <param name="tokenKey">Token key</param>
    /// <returns>Generated validation parameters by given token key</returns>
    private TokenValidationParameters CreateValidationParameters(string tokenKey)
    {
        return new TokenValidationParameters
        {
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenKey)),
            ValidateIssuer = true,
            ValidIssuer = _autoLogConfig.Jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = _autoLogConfig.Jwt.Audience
        };
    }

    /// <summary>
    /// Method to get user
    /// </summary>
    /// <param name="refreshUserId">User id</param>
    /// <returns>User</returns>
    /// <exception cref="AuthenticationException">Exception thrown in case if user not found</exception>
    /// <exception cref="ActivationException">Exception thrown if user is deleted or deactivated</exception>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0046:Convert to conditional expression", Justification = "<Pending>")]
    private async Task<ApplicationUser> GetUserWithValidationAsync(string refreshUserId)
    {
        var user = await _userManager.Users.IgnoreQueryFilters().FirstOrDefaultAsync(user => user.Id == refreshUserId)
            ?? throw new AuthenticationException(ErrorCodes.USER_NOT_FOUND, ErrorCodes.USER_NOT_FOUND);

        if (user.IsDeleted)
            throw new ActivationException(ErrorCodes.USER_IS_DELETED, ErrorCodes.USER_IS_DELETED, user.DeactivationReason!);
        if (user.IsDeactivated)
            throw new ActivationException(ErrorCodes.USER_IS_DEACTIVATED, ErrorCodes.USER_IS_DEACTIVATED, user.DeactivationReason!);

        return user;
    }
}
