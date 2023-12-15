using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Security;
using AutoLog.Infrastructure.Common;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AutoLog.Infrastructure.Identity;

/// <summary>
/// Token provider to generate, validate token with email
/// </summary>
public class InvitationTokenProvider : IInvitationTokenProvider
{
    public InvitationTokenProvider(IDataProtectionProvider dataProtectionProvider,
        IOptions<InvitationTokenProviderOptions> options,
        ILogger<InvitationTokenProvider> logger)
    {

        if (dataProtectionProvider is null)
            throw new ArgumentNullException(nameof(dataProtectionProvider));


        Options = options?.Value ?? new DataProtectionTokenProviderOptions();

        // Use the Name as the purpose which should usually be distinct from others
        Protector = dataProtectionProvider.CreateProtector(Name ?? "DataProtectorTokenProvider");
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
    public ILogger<InvitationTokenProvider> Logger { get; }

    /// <summary>
    /// Generate token for given purpose with email
    /// </summary>
    /// <param name="purpose">Purpose of generating</param>
    /// <param name="user">User</param>
    /// <returns>Token with email</returns>
    /// <exception cref="ArgumentNullException">Exception thrown if userId is null or empty</exception>
    public virtual string Generate(string purpose, UserInvitationToken user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }
        var ms = new MemoryStream();

        using (var writer = ms.CreateWriter())
        {
            writer.Write(DateTimeOffset.UtcNow);
            writer.Write(user.Email);
            writer.Write(user.Role);
            writer.Write(purpose ?? "");
        }
        var protectedBytes = Protector.Protect(ms.ToArray());
        return Convert.ToBase64String(protectedBytes);
    }

    /// <summary>
    /// Method to validate given token by purpose
    /// </summary>
    /// <param name="purpose">Purpose token was generated with</param>
    /// <param name="role">User role</param>
    /// <param name="token">Token</param>
    /// <returns>True in case of success validation</returns>
    public virtual bool Validate(string purpose, string role, string token)
    {
        try
        {
            var unprotectedData = Protector.Unprotect(Convert.FromBase64String(token));
            var ms = new MemoryStream(unprotectedData);
            using var reader = ms.CreateReader();

            var creationTime = reader.ReadDateTimeOffset();
            var expirationTime = creationTime + Options.TokenLifespan;

            var userEmail = reader.ReadString();
            var userRole = reader.ReadString();
            var purp = reader.ReadString();
            if (!string.Equals(userRole, role) || !string.Equals(purp, purpose))
                return false;
        }
        catch
        {
            return false;
        }

        return true;
    }

    /// <summary>
    /// Method to get email from token
    /// </summary>
    /// <param name="token">Token</param>
    /// <returns>Email</returns>
    public string GetEmailFromToken(string token)
    {
        var userEmail = string.Empty;
        var unprotectedData = Protector.Unprotect(Convert.FromBase64String(token));
        var ms = new MemoryStream(unprotectedData);
        using (var reader = ms.CreateReader())
        {
            var creationTime = reader.ReadDateTimeOffset();
            userEmail = reader.ReadString();
            var userRole = reader.ReadString();
            var purp = reader.ReadString();
        }

        return userEmail;
    }
}

public class InvitationTokenProviderOptions : DataProtectionTokenProviderOptions
{
    public InvitationTokenProviderOptions()
    {
        TokenLifespan = TimeSpan.FromDays(14);
    }
}