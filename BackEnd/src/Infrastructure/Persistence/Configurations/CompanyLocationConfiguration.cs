using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class CompanyLocationConfiguration : IEntityTypeConfiguration<CompanyLocation>
{
    public void Configure(EntityTypeBuilder<CompanyLocation> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(f => f.InLandAddress)
            .WithOne()
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(f => f.MailingAddress)
            .WithOne()
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(f => f.DestinationPort)
            .WithMany()
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(f => f.Insurance).HasDefaultValue(default);
        builder.Property(f => f.CustomClearance).HasDefaultValue(default);
        builder.Property(f => f.MadeBySystem).HasDefaultValue(default);
        builder.Property(f => f.InLandAuthority).HasDefaultValue(string.Empty);
        builder.Property(f => f.DestinationPortId).HasDefaultValue(default);
    }
}
