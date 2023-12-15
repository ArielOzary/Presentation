using AutoLog.Application.Common.Constants;
using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;
public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.HasQueryFilter(u => !u.IsDeleted);

        builder.Property(x => x.FirstName).HasDefaultValue(string.Empty).IsRequired();
        builder.Property(x => x.LastName).HasDefaultValue(string.Empty).IsRequired();
        builder.Property(x => x.Locale).HasDefaultValue(Locales.English).IsRequired();

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

        builder.OwnsOne(e => e.ReminderEmail);
    }
}
