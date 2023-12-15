using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class ShipmentConfiguration : IEntityTypeConfiguration<Shipment>
{
    public void Configure(EntityTypeBuilder<Shipment> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Rate)
            .WithMany(y => y.Shipments)
            .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(x => x.Company)
            .WithMany(y => y.Shipments)
            .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(x => x.Quote)
            .WithOne(y => y.Shipment)
            .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(x => x.ShippingType)
            .WithMany(y => y.Shipments)
            .OnDelete(DeleteBehavior.NoAction);
        builder.HasMany(x => x.ShipmentStatuses)
            .WithOne(y => y.Shipment)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.User)
            .WithMany(y => y.Shipments)
            .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(x => x.Conversation)
            .WithOne(y => y.Shipment)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
