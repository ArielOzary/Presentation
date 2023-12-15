using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class ProviderInfoConfiguration : IEntityTypeConfiguration<ProviderInfo>
{
    public void Configure(EntityTypeBuilder<ProviderInfo> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.User)
            .WithOne(x => x.ProviderInfo)
            .HasForeignKey<ProviderInfo>(x => x.UserId);
    }
}
