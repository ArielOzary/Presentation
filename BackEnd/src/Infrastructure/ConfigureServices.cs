using System.Text;
using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using Amazon.SimpleEmail;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Interfaces.HttpClients;
using AutoLog.Application.Common.MassTransit.Requests;
using AutoLog.Application.Common.Utils;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Configurations;
using AutoLog.Infrastructure.ExternalClients.EuroExchangeRatesClient;
using AutoLog.Infrastructure.Files;
using AutoLog.Infrastructure.Identity;
using AutoLog.Infrastructure.MassTransit;
using AutoLog.Infrastructure.MassTransit.Consumers;
using AutoLog.Infrastructure.Persistence;
using AutoLog.Infrastructure.Persistence.Interceptors;
using AutoLog.Infrastructure.Services;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var config = GetAutoLogConfig(configuration);
        var awsConfig = GetAwsConfig(configuration);
        var awsSesConfig = GetAwsSesConfig(configuration);
        var awsS3Config = GetAwsS3Config(configuration);
        var rabbitMqConfig = GetRabbitMqConfig(configuration);

        services.Configure<BackgroundJobOptions>(configuration.GetSection("BackgroundJob"));
        services.Configure<PortsSeedJobOptions>(configuration.GetSection("PortsSeedJob"));
        services.Configure<AwsSesOptions>(configuration.GetSection("AwsSes"));
        services.Configure<ContainerTrackingOptions>(configuration.GetSection("ContainerTracking"));

        services.Configure<IISServerOptions>(options => options.MaxRequestBodySize = int.MaxValue);

        services.Configure<KestrelServerOptions>(options => options.Limits.MaxRequestBodySize = int.MaxValue);

        services.Configure<FormOptions>(options => options.MultipartBodyLengthLimit = int.MaxValue);

        services.AddSingleton(typeof(AutoLogConfig), config);
        services.AddSingleton(typeof(AwsConfig), awsConfig);
        services.AddSingleton(typeof(AwsSesConfig), awsSesConfig);
        services.AddSingleton(typeof(AwsS3Config), awsS3Config);
        services.AddSingleton(typeof(RabbitMqConfig), rabbitMqConfig);

        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        if (config.UseInMemoryDatabase)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("AutoLogDb"));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(config.ConnectionStrings.DefaultConnection,
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
        }

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<ApplicationDbContextInitialiser>();

        services.AddIdentity<ApplicationUser, ApplicationRole>(config =>
            config.Tokens.PasswordResetTokenProvider = "AutoLogResetPassword")
            .AddErrorDescriber<AutoLogIdentityErrorDescriber>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddTokenProvider<AutoLogResetPasswordConfirmationTokenProvider<ApplicationUser>>("AutoLogResetPassword")
            .AddDefaultTokenProviders();

        services.AddMassTransit(x =>
        {
            x.AddRequestClient<QuoteCalculationInfoRequest>();
            x.AddRequestClient<NewAvailableQuotesCalculationRequest>();
            x.AddConsumer<ShipmentStatusConsumer>();
            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Message<QuoteCalculationInfoRequest>(x => x.SetEntityName(rabbitMqConfig.AvailableQuotesCalculationExchangeName));
                cfg.Message<NewAvailableQuotesCalculationRequest>(x => x.SetEntityName(rabbitMqConfig.CustomRequestedQuotesExchangeName));
                cfg.ReceiveEndpoint(rabbitMqConfig.ShipmentStatusQueueName, e =>
                {
                    e.ConfigureConsumeTopology = false;
                    e.ClearSerialization();
                    e.UseRawJsonSerializer();
                    e.UseRawJsonDeserializer();
                    e.PrefetchCount = 16;
                    e.UseMessageRetry(r => r.Interval(2, 3000));
                    e.ConfigureConsumer<ShipmentStatusConsumer>(context);
                });

                cfg.Host(rabbitMqConfig.ConnectionString);
                cfg.ConfigureEndpoints(context);
            });
        });
        services.AddScoped<IMassTransitService, MassTransitService>();

        var awsOptions = new AWSOptions
        {
            Credentials = new Amazon.Runtime.BasicAWSCredentials(awsConfig.AWSAccessKey, awsConfig.AWSSecretKey),
            Region = Amazon.RegionEndpoint.GetBySystemName(awsConfig.AWSRegion)
        };
        services.AddDefaultAWSOptions(awsOptions);

        services.AddSingleton<IAmazonSimpleEmailService>(ses => new AmazonSimpleEmailServiceClient(awsOptions.Credentials, new AmazonSimpleEmailServiceConfig { ServiceURL = awsSesConfig.AWSSesServiceUrl }));
        services.AddScoped<IEmailSender, EmailSender>();
        services.AddScoped<IEmailService, EmailService>();

        services.AddSingleton<IAmazonS3>(s3 => new AmazonS3Client(awsOptions.Credentials, new AmazonS3Config { ServiceURL = awsS3Config.AWSS3ServiceUrl }));
        services.AddScoped<IFileService, FileService>();

        services.AddScoped<IECBEuroExchangeRatesHttpClient, ECBEuroExchangeRatesHttpClient>();

        services.AddTransient<IInvitationTokenProvider, InvitationTokenProvider>();
        services.AddTransient<IAutoLogResetPasswordConfirmationTokenProvider, AutoLogResetPasswordConfirmationTokenProvider<ApplicationUser>>();
        services.AddTransient<IUserIdTokenProvider, UserIdTokenProvider>();
        services.AddTransient<IDateTime, DateTimeService>();
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<ICsvFileBuilder, CsvFileBuilder>();
        services.AddTransient<IJwtProvider, JwtProvider>();
        services.AddScoped<IUserValidationService, UserValidationService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICurrencyExchangeRateService, CurrencyExchangeRateService>();
        services.AddScoped<IQuoteRateNotifierService, QuoteRateNotifierService>();
        services.AddScoped<IReminderService, ReminderService>();
        services.AddScoped<IContainersTrackerService, ContainersTrackerService>();
        services.AddScoped<IParserHandlerService, ParserHandlerService>();

        services.AddScoped<IPortsSeeder, PortsSeeder>();
        services.AddHttpClient<IPortsSeeder, PortsSeeder>();

        services.AddTransient<IAttachmentFileService<CompanySupplierFile, int>, AttachmentFileService<CompanySupplierFile, int>>();
        services.AddTransient<IAttachmentFileService<QuoteFile, int>, AttachmentFileService<QuoteFile, int>>();
        services.AddTransient<IAttachmentFileService<ShipmentFile, string>, AttachmentFileService<ShipmentFile, string>>();
        services.AddTransient<IAttachmentFileService<MessageFile, string>, AttachmentFileService<MessageFile, string>>();

        services.AddAuthorization(AddAuthorizationOptions);
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config.Jwt.Issuer,
                ValidAudience = config.Jwt.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.Jwt.TokenKey)),
                ClockSkew = TimeSpan.FromSeconds(5)
            };


            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) &&
                        path.StartsWithSegments("/chatHub"))
                    {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }

    private static AutoLogConfig GetAutoLogConfig(IConfiguration configuration)
    {
        var config = new AutoLogConfig();
        configuration.GetSection(AutoLogConfig.ConfigName).Bind(config);

        return config;
    }

    private static AwsConfig GetAwsConfig(IConfiguration configuration)
    {
        var config = new AwsConfig();
        configuration.GetSection(AwsConfig.ConfigName).Bind(config);

        return config;
    }

    private static AwsSesConfig GetAwsSesConfig(IConfiguration configuration)
    {
        var config = new AwsSesConfig();
        configuration.GetSection(AwsSesConfig.ConfigName).Bind(config);

        return config;
    }

    private static AwsS3Config GetAwsS3Config(IConfiguration configuration)
    {
        var config = new AwsS3Config();
        configuration.GetSection(AwsS3Config.ConfigName).Bind(config);

        return config;
    }

    private static RabbitMqConfig GetRabbitMqConfig(IConfiguration configuration)
    {
        var config = new RabbitMqConfig();
        configuration.GetSection(RabbitMqConfig.ConfigName).Bind(config);

        return config;
    }

    private static void AddAuthorizationOptions(AuthorizationOptions options)
    {
        options.AddPolicy(Policies.AdminRights, policy => policy.RequireRole(Roles.Admin));
        options.AddPolicy(Policies.FreightForwarderRights, policy => policy.RequireRole(Roles.FreightForwarder));
        options.AddPolicy(Policies.FreightForwarderOrAdminRights, policy => policy.RequireRole(Roles.FreightForwarder, Roles.Admin));
    }
}
