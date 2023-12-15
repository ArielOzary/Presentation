using AutoLog.IdentityApi.DAL.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.IdentityApi.DAL;

/// <summary>
/// Autolog identity db context
/// </summary>
public class AutologIdentityDbContext : IdentityDbContext<ApplicationUser,
    ApplicationRole,
    string,
    ApplicationUserClaim,
    ApplicationUserRole,
    ApplicationUserLogin,
    ApplicationRoleClaim,
    ApplicationUserToken>
{
    public AutologIdentityDbContext(DbContextOptions<AutologIdentityDbContext> options) : base(options)
    {

    }

    public DbSet<Company> Companies => Set<Company>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<ApplicationRole>(builder =>
        {
            builder.HasMany(e => e.UserRoles)
              .WithOne(e => e.Role)
              .HasForeignKey(ur => ur.RoleId).IsRequired();

            builder.HasMany(e => e.RoleClaims)
                .WithOne(e => e.Role)
                .HasForeignKey(rc => rc.RoleId).IsRequired();
        });

        b.Entity<ApplicationUser>(builder =>
        {
            builder.HasQueryFilter(u => !u.IsDeleted);

            builder.Property(x => x.FirstName).HasDefaultValue(string.Empty).IsRequired();
            builder.Property(x => x.LastName).HasDefaultValue(string.Empty).IsRequired();
            builder.Property(x => x.Locale).HasDefaultValue("en").IsRequired();

            builder.HasMany(e => e.Claims)
                 .WithOne(e => e.User)
                 .HasForeignKey(uc => uc.UserId)
                 .IsRequired();

            builder.HasMany(e => e.Logins)
                .WithOne(e => e.User)
                .HasForeignKey(ul => ul.UserId)
                .IsRequired();

            builder.HasMany(e => e.Tokens)
                .WithOne(e => e.User)
                .HasForeignKey(ut => ut.UserId)
                .IsRequired();

            builder.HasMany(e => e.UserRoles)
                .WithOne(e => e.User)
                .HasForeignKey(ut => ut.UserId)
                .IsRequired();
        });

        base.OnModelCreating(b);

    }
}
