namespace AutoLog.IdentityApi.Exceptions;

/// <summary>
/// List of possible error codes for AutoLogException
/// </summary>
public static class ErrorCodes
{
    public const string FIELD_REQUIRED = "FIELD_REQUIRED";

    public const string USER_NOT_FOUND = "USER_NOT_FOUND";

    public const string USER_ALREADY_EXISTING = "USER_ALREADY_EXISTING";

    public const string USER_NOT_VERIFIED = "USER_NOT_VERIFIED";

    public const string USER_IS_DEACTIVATED = "USER_IS_DEACTIVATED";

    public const string CONFIRMATION_FAILED = "CONFIRMATION_FAILED";

    public const string PASSWORDS_NOT_MATCH = "PASSWORDS_NOT_MATCH";

    public const string AUTH_FAILED = "AUTH_FAILED";

    public const string REFRESH_ACCESS_TOKEN_FAILED = "REFRESH_ACCESS_TOKEN_FAILED";

    public const string COMMENTS_LENGTH_EXCEEDED_100 = "COMMENTS_LENGTH_EXCEEDED_100";

    public const string USER_IS_DELETED = "USER_IS_DELETED";

    public const string UNSUPPORTED_LOCALE = "UNSUPPORTED_LOCALE";
}
