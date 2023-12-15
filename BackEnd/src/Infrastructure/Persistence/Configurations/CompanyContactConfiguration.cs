using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class CompanyContactConfiguration : IEntityTypeConfiguration<CompanyContact>
{
    public void Configure(EntityTypeBuilder<CompanyContact> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(f => f.Company)
            .WithMany(d => d.Contacts)
            .HasForeignKey(f => f.CompanyId);

        builder.Property(x => x.Name).HasDefaultValue(string.Empty);
        builder.Property(x => x.JobTitle).HasDefaultValue(string.Empty);
        builder.Property(x => x.Email).HasDefaultValue(string.Empty);
        builder.Property(x => x.Fax).HasDefaultValue(string.Empty);
        builder.Property(x => x.PhoneNumber).HasDefaultValue(string.Empty);
    }
}
