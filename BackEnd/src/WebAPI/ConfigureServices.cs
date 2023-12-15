using System.Globalization;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Persistence;
using AutoLog.WebAPI.Services;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using NSwag;
using NSwag.Generation.Processors.Security;
using WebAPI.Background;
using WebAPI.CachesPolicies;
using WebAPI.Middlewares;
using ZymLabs.NSwag.FluentValidation;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddWebAPIServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddHttpContextAccessor();

        services.AddCors(o => o.AddPolicy("AllowAnyOrigin", builder => builder
            .SetIsOriginAllowed(origin => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()));


        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();
        services.AddScoped(provider =>
        {
            var validationRules = provider.GetService<IEnumerable<FluentValidationRule>>();
            var loggerFactory = provider.GetService<ILoggerFactory>();

            return new FluentValidationSchemaProcessor(provider, validationRules, loggerFactory);
        });

        //services.AddHostedService<QuotesAvailabilityJob>();
        services.AddHostedService<DeactivateRatesJob>();
        services.AddHostedService<PortsJob>();
        services.AddHostedService<ShipmentStatusJob>();
        services.AddHostedService<RemindJob>();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddControllers().AddNewtonsoftJson();
        services.AddEndpointsApiExplorer();
        services.AddOpenApiDocument((configure, serviceProvider) =>
        {
            var fluentValidationSchemaProcessor = serviceProvider.CreateScope().ServiceProvider.GetRequiredService<FluentValidationSchemaProcessor>();

            // Add the fluent validations schema processor
            configure.SchemaProcessors.Add(fluentValidationSchemaProcessor);
            configure.Title = "Autolog API";
            configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Type into the textbox: Bearer {your JWT token}."
            });

            configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
        });

        services.AddLocalization();
        services.Configure<RequestLocalizationOptions>(options =>
        {
            List<CultureInfo> supportedCultures = Locales.Supported.Select(x => new CultureInfo(x)).ToList();
            options.DefaultRequestCulture = new RequestCulture(Locales.English);
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedCultures;

            options.RequestCultureProviders = new List<IRequestCultureProvider> { new AcceptLanguageRequestCultureProvider() };
        });

        services.AddSignalR();

        services.AddOutputCache(options =>
        {
            options.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(int.Parse(configuration.GetSection("Cache:RegularDuration").Value!));

            options.AddPolicy(CachePolicies.Ports, builder =>
                builder.AddPolicy<OutputCacheWithAuthPolicy>().Tag(CacheTags.Ports));

            options.AddPolicy(CachePolicies.IndustryTypes, builder =>
                builder.AddPolicy<OutputCacheWithAuthPolicy>().Tag(CacheTags.IndustryTypes));

            options.AddPolicy(CachePolicies.Cities, builder =>
                builder.AddPolicy<OutputCacheWithAuthPolicy>().Tag(CacheTags.Cities));

            options.AddPolicy(CachePolicies.Countries, builder =>
                builder.AddPolicy<OutputCacheWithAuthPolicy>().Tag(CacheTags.Countries));

            options.AddPolicy(CachePolicies.ContainersFull, builder =>
                builder.AddPolicy<OutputCacheWithAuthPolicy>().Tag(CacheTags.ContainersFull));

            options.AddPolicy(CachePolicies.ContainersShort, builder =>
                builder.AddPolicy<OutputCacheWithAuthPolicy>().Tag(CacheTags.ContainersShort));
        });

        return services;
    }
}
