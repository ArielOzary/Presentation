namespace AutoLog.Application.Common.Dtos;

public class TokenResultDto
{
    /// <summary>
    /// Gets or sets the access token.
    /// </summary>
    /// <value>
    /// The access token.
    /// </value>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the access token lifetime.
    /// </summary>
    /// <value>
    /// The access token lifetime.
    /// </value>
    public int AccessTokenLifetime { get; set; }
}
