using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<ApplicationUser> Users { get; }

    DbSet<Company> Companies { get; }

    DbSet<CompanyContact> CompanyContacts { get; }

    DbSet<CompanyLocation> CompanyLocations { get; }

    DbSet<CompanyLocationAddress> CompanyLocationAddresses { get; }

    DbSet<ClientProfits> ClientProfits { get; }

    DbSet<ProviderInfo> ProviderInfos { get; }

    DbSet<IndustryType> IndustryTypes { get; }

    DbSet<Port> Ports { get; }

    DbSet<Rate> Rates { get; }

    DbSet<RateCharges> RateCharges { get; }

    DbSet<Quote> Quotes { get; }

    DbSet<ShippingLocation> ShippingLocations { get; }

    DbSet<QuoteLoad> QuoteLoads { get; }

    DbSet<QuoteGood> QuoteGoods { get; }

    DbSet<Shipment> Shipments { get; }

    DbSet<ShipmentStatus> ShipmentStatuses { get; }

    DbSet<Message> Messages { get; }

    DbSet<Conversation> Conversations { get; }

    DbSet<QuoteFile> QuoteFiles { get; }

    DbSet<ShipmentFile> ShipmentFiles { get; }

    DbSet<MessageFile> MessageFiles { get; }

    DbSet<CompanySupplier> CompanySuppliers { get; }

    DbSet<CompanySupplierFile> CompanySupplierFiles { get; }

    DbSet<RecentQuoteSearch> RecentQuoteSearchs { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    DbSet<TEntity> Set<TEntity>() where TEntity : class;
}
