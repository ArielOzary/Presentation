using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class ShipmentStatusConfiguration : IEntityTypeConfiguration<ShipmentStatus>
{
    public void Configure(EntityTypeBuilder<ShipmentStatus> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasMany(x => x.ChildrenShipmentStatuses)
            .WithOne(x => x.ParentShipmentStatus)
            .HasForeignKey(x => x.ParentShipmentStatusId);
    }
}