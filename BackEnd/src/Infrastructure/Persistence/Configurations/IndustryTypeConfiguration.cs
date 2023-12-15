using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class IndustryTypeConfiguration : IEntityTypeConfiguration<IndustryType>
{
    public void Configure(EntityTypeBuilder<IndustryType> builder)
    {
        builder.HasKey(x => x.Id);
    }
}
