namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service to receive information about user who is doing requests to api
/// </summary>
public interface ICurrentUserService
{
    string? UserId { get; }

    string? Email { get; }

    List<string>? Roles { get; }

    int? CompanyId { get; }
}
