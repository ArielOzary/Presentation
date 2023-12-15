using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public class RecentQuoteSearchConfiguration : IEntityTypeConfiguration<RecentQuoteSearch>
{
    public void Configure(EntityTypeBuilder<RecentQuoteSearch> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.User)
            .WithMany(y => y.RecentQuoteSearches)
            .OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(x => x.QuoteGood)
            .WithOne(y => y.RecentQuoteSearch)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(x => x.QuoteLoads)
            .WithOne(y => y.RecentQuoteSearch)
            .HasForeignKey(x => x.RecentQuoteSearchId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
