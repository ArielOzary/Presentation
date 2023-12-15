using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public sealed class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(f => f.Shipment).WithOne(x => x.Conversation).OnDelete(DeleteBehavior.NoAction);
        builder.HasMany(f => f.Users).WithMany(x => x.Conversations);
        builder.HasMany(f => f.Messages).WithOne(x => x.Conversation).OnDelete(DeleteBehavior.Cascade);
    }
}