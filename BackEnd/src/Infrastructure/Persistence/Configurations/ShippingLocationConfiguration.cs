using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class ShippingLocationConfiguration : IEntityTypeConfiguration<ShippingLocation>
{
    public void Configure(EntityTypeBuilder<ShippingLocation> builder)
    {
        builder.HasOne(f => f.Port)
            .WithMany()
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(f => f.PortId).HasDefaultValue(default);
    }
}
