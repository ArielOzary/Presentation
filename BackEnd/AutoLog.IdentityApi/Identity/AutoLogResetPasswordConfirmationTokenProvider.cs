using AutoLog.IdentityApi.Extensions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace AutoLog.IdentityApi.Identity;

/// <summary>
/// Token provider for confirmation of password reset
/// </summary>
/// <typeparam name="TUser">Generic user</typeparam>
public class AutoLogResetPasswordConfirmationTokenProvider<TUser>
                              : DataProtectorTokenProvider<TUser>, IAutoLogResetPasswordConfirmationTokenProvider where TUser : class
{
    public AutoLogResetPasswordConfirmationTokenProvider(
        IDataProtectionProvider dataProtectionProvider,
        IOptions<AutoLogResetPasswordConfirmationTokenProviderOptions> options,
        ILogger<DataProtectorTokenProvider<TUser>> logger)
                                       : base(dataProtectionProvider, options, logger)
    {

    }

    /// <summary>
    /// Method to get user id from authorization token 
    /// </summary>
    /// <param name="token">Auth token</param>
    /// <returns>User id</returns>
    public string GetUserIdFromToken(string token)
    {
        var userId = string.Empty;
        var unprotectedData = Protector.Unprotect(Convert.FromBase64String(token));
        var ms = new MemoryStream(unprotectedData);
        using (var reader = ms.CreateReader())
        {
            var creationTime = reader.ReadDateTimeOffset();
            userId = reader.ReadString();
        }

        return userId;
    }
}

public class AutoLogResetPasswordConfirmationTokenProviderOptions : DataProtectionTokenProviderOptions
{
    public AutoLogResetPasswordConfirmationTokenProviderOptions()
    {
        TokenLifespan = TimeSpan.FromMinutes(5);
    }
}