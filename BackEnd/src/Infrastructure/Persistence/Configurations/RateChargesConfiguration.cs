using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class RateChargesConfiguration : IEntityTypeConfiguration<RateCharges>
{
    public void Configure(EntityTypeBuilder<RateCharges> builder)
    {
        builder.Property(x => x.FixedPriced).HasDefaultValue(string.Empty);
        builder.Property(x => x.PerWeight).HasDefaultValue(string.Empty);
        builder.Property(x => x.PerType).HasDefaultValue(string.Empty);
    }
}
