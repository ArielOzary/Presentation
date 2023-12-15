using System.Web;
using AutoLog.IdentityApi.Extensions;
using AutoLog.IdentityApi.Services.Interfaces;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace AutoLog.IdentityApi.Services;

/// <summary>
/// Token provider to generate, validate token with user id
/// </summary>
internal class UserIdTokenProvider : IUserIdTokenProvider
{
    public UserIdTokenProvider(IDataProtectionProvider dataProtectionProvider,
        IOptions<UserIdTokenProviderOptions> options,
        ILogger<UserIdTokenProvider> logger)
    {

        if (dataProtectionProvider is null)
        {
            throw new ArgumentNullException(nameof(dataProtectionProvider));
        }

        Options = options?.Value ?? new DataProtectionTokenProviderOptions();
        string baseFolder = AppContext.BaseDirectory;
        Protector = DataProtectionProvider.Create(new DirectoryInfo(Path.Combine(baseFolder, "Resources", "Keys")), x => x.DisableAutomaticKeyGeneration()).CreateProtector("DataProtectorTokenProvider");
        Logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets the <see cref="DataProtectionTokenProviderOptions"/> for this instance.
    /// </summary>
    /// <value>
    /// The <see cref="DataProtectionTokenProviderOptions"/> for this instance.
    /// </value>
    protected DataProtectionTokenProviderOptions Options { get; private set; }

    /// <summary>
    /// Gets the <see cref="IDataProtector"/> for this instance.
    /// </summary>
    /// <value>
    /// The <see cref="IDataProtector"/> for this instance.
    /// </value>
    protected IDataProtector Protector { get; private set; }

    /// <summary>
    /// Gets the name of this instance.
    /// </summary>
    /// <value>
    /// The name of this instance.
    /// </value>
    public string Name { get => Options.Name; }

    /// <summary>
    /// Gets the <see cref="ILogger"/> used to log messages from the provider.
    /// </summary>
    /// <value>
    /// The <see cref="ILogger"/> used to log messages from the provider.
    /// </value>
    public ILogger<UserIdTokenProvider> Logger { get; }

    /// <summary>
    /// Generate token for given purpose with user id
    /// </summary>
    /// <param name="purpose">Purpose of generating</param>
    /// <param name="userId">User id</param>
    /// <returns>Token with user id</returns>
    /// <exception cref="ArgumentNullException">Exception thrown if userId is null or empty</exception>
    public virtual string Generate(string purpose, string userId)
    {
        if (string.IsNullOrEmpty(userId))
            throw new ArgumentNullException(nameof(userId));

        var ms = new MemoryStream();

        using (var writer = ms.CreateWriter())
        {
            writer.Write(DateTimeOffset.UtcNow);
            writer.Write(userId);
            writer.Write(purpose ?? "");
        }
        var protectedBytes = Protector.Protect(ms.ToArray());
        var ss = Convert.ToBase64String(protectedBytes);
        var result = HttpUtility.UrlEncode(ss);
        return result;
    }

    /// <summary>
    /// Method to validate given token by purpose
    /// </summary>
    /// <param name="purpose">Purpose token was generated with</param>
    /// <param name="token">Token</param>
    /// <returns>True in case of success validation</returns>
    public virtual bool Validate(string purpose, string token)
    {
        try
        {
            var unprotectedData = Protector.Unprotect(Convert.FromBase64String(token));
            var ms = new MemoryStream(unprotectedData);
            using var reader = ms.CreateReader();

            var creationTime = reader.ReadDateTimeOffset();
            var userId = reader.ReadString();
            var purp = reader.ReadString();
            if (!string.Equals(purp, purpose))
            {
                return false;
            }
        }
        catch
        {
            return false;
        }

        return true;
    }

    /// <summary>
    /// Method to get user id from token
    /// </summary>
    /// <param name="token">Token</param>
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
            var purp = reader.ReadString();
        }

        return userId;
    }
}

public class UserIdTokenProviderOptions : DataProtectionTokenProviderOptions
{
    public UserIdTokenProviderOptions()
    {
        TokenLifespan = TimeSpan.FromDays(14);
        Name = "DataProtectorTokenProvider";
    }
}