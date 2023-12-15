namespace AutoLog.IdentityApi.DAL.Entities;

/// <summary>
/// User`s company
/// </summary>
public class Company
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;
}
