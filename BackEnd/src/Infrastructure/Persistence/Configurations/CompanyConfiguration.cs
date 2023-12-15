using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.User)
            .WithOne(x => x.Company)
            .HasForeignKey<Company>(x => x.UserId);

        builder.HasMany(e => e.Rates)
            .WithOne(e => e.Company)
            .HasForeignKey(ut => ut.CompanyId)
            .IsRequired();

        builder.HasMany(e => e.Quotes)
            .WithOne(e => e.Company)
            .HasForeignKey(ut => ut.CompanyId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Property(x => x.Fax).HasDefaultValue(string.Empty);
        builder.Property(x => x.Email).HasDefaultValue(string.Empty);
        builder.Property(x => x.LegalNumber).HasDefaultValue(string.Empty);
        builder.Property(x => x.NameEn).HasDefaultValue(string.Empty);
        builder.Property(x => x.NameHe).HasDefaultValue(string.Empty);
        builder.Property(x => x.VATNumber).HasDefaultValue(string.Empty);
    }
}
