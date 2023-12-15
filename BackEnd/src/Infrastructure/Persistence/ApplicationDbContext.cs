using MediatR;
using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Persistence.Interceptors;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string,
    ApplicationUserClaim, ApplicationUserRole, ApplicationUserLogin,
    ApplicationRoleClaim, ApplicationUserToken>, IApplicationDbContext
{
    private readonly IMediator _mediator;
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IMediator mediator,
        AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor)
        : base(options)
    {
        _mediator = mediator;
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
    }

    public DbSet<Company> Companies => Set<Company>();

    public DbSet<CompanyContact> CompanyContacts => Set<CompanyContact>();

    public DbSet<CompanyLocation> CompanyLocations => Set<CompanyLocation>();

    public DbSet<CompanyLocationAddress> CompanyLocationAddresses => Set<CompanyLocationAddress>();

    public DbSet<ClientProfits> ClientProfits => Set<ClientProfits>();

    public DbSet<ProviderInfo> ProviderInfos => Set<ProviderInfo>();

    public DbSet<IndustryType> IndustryTypes => Set<IndustryType>();

    public DbSet<Port> Ports => Set<Port>();

    public DbSet<Rate> Rates => Set<Rate>();

    public DbSet<RateCharges> RateCharges => Set<RateCharges>();

    public DbSet<ShippingType> ShippingTypes => Set<ShippingType>();

    public DbSet<Quote> Quotes => Set<Quote>();

    public DbSet<ShippingLocation> ShippingLocations => Set<ShippingLocation>();

    public DbSet<QuoteLoad> QuoteLoads => Set<QuoteLoad>();

    public DbSet<QuoteGood> QuoteGoods => Set<QuoteGood>();

    public DbSet<Shipment> Shipments => Set<Shipment>();

    public DbSet<ShipmentStatus> ShipmentStatuses => Set<ShipmentStatus>();

    public DbSet<Message> Messages => Set<Message>();

    public DbSet<Conversation> Conversations => Set<Conversation>();

    public DbSet<QuoteFile> QuoteFiles => Set<QuoteFile>();

    public DbSet<ShipmentFile> ShipmentFiles => Set<ShipmentFile>();

    public DbSet<MessageFile> MessageFiles => Set<MessageFile>();

    public DbSet<CompanySupplier> CompanySuppliers => Set<CompanySupplier>();

    public DbSet<CompanySupplierFile> CompanySupplierFiles => Set<CompanySupplierFile>();

    public DbSet<RecentQuoteSearch> RecentQuoteSearchs => Set<RecentQuoteSearch>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _mediator.DispatchDomainEventsAsync(this);

        return await base.SaveChangesAsync(cancellationToken);
    }

    public override DbSet<TEntity> Set<TEntity>()
        where TEntity : class
        => base.Set<TEntity>();
}
