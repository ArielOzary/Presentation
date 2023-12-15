using AutoLog.Application.Common.Dtos.Roles;
using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.ApplicationUser;

public class UserDto
{
    public string Id { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public bool IsDeactivated { get; set; }

    public UserVerificationStatus Status { get; set; }

    public string Locale { get; set; } = string.Empty;

    public bool IsDeleted { get; set; }

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public List<RoleDto> Roles { get; set; } = new();
}
