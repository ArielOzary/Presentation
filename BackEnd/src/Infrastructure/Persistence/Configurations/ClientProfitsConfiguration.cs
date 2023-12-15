using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class ClientProfitsConfiguration : IEntityTypeConfiguration<ClientProfits>
{
    public void Configure(EntityTypeBuilder<ClientProfits> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.User)
            .WithOne(x => x.ClientProfits)
            .HasForeignKey<ClientProfits>(x => x.UserId);

        builder.Property(x => x.LCL).HasDefaultValue(default);
        builder.Property(x => x.FCL).HasDefaultValue(default);
        builder.Property(x => x.Air).HasDefaultValue(default);
        builder.Property(x => x.CustomClearance).HasDefaultValue(default);
        builder.Property(x => x.OriginCharges).HasDefaultValue(default);
        builder.Property(x => x.DestinationCharges).HasDefaultValue(default);
    }
}
