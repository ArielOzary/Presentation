using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AutoLog.Infrastructure.Persistence.Configurations;

public sealed class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(f => f.Conversation).WithMany(x => x.Messages).OnDelete(DeleteBehavior.NoAction);
        builder.HasOne(f => f.User).WithMany(x => x.Messages).OnDelete(DeleteBehavior.NoAction);
    }
}
