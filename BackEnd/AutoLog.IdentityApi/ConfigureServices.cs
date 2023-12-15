using System.Text;
using AutoLog.IdentityApi.DAL;
using AutoLog.IdentityApi.DAL.Entities;
using AutoLog.IdentityApi.Enums;
using AutoLog.IdentityApi.Identity;
using AutoLog.IdentityApi.Options;
using AutoLog.IdentityApi.Services;
using AutoLog.IdentityApi.Services.Interfaces;
using AutoLog.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AutoLog.IdentityApi;

public static class ConfigureServices
{
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        var origins = configuration["AllowedOrigins"]?
            .Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);

        services.AddIdentity<ApplicationUser, ApplicationRole>(config =>
            config.Tokens.PasswordResetTokenProvider = "AutoLogResetPassword")
            .AddErrorDescriber<AutoLogIdentityErrorDescriber>()
            .AddEntityFrameworkStores<AutologIdentityDbContext>()
            .AddTokenProvider<AutoLogResetPasswordConfirmationTokenProvider<ApplicationUser>>("AutoLogResetPassword")
            .AddDefaultTokenProviders();

        services.Configure<AutoLogOptions>(configuration.GetSection("AutoLog"));

        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<IJwtProvider, JwtProvider>();
        services.AddTransient<IUserIdTokenProvider, UserIdTokenProvider>();

        services.AddCors(o => o.AddPolicy("AllowAnyOrigin", builder =>
            builder.WithOrigins(origins!)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()));

        var autoLogOptions = configuration.GetSection("AutoLog").Get<AutoLogOptions>()!;
        services.AddDatabase(autoLogOptions);
        services.AddAuthenticationAndDatabase(autoLogOptions);

        return services;
    }

    public static IServiceCollection AddAuthenticationAndDatabase(
        this IServiceCollection services,
        AutoLogOptions autoLogOptions)
    {
        services.AddAuthorization((options) =>
        {
            options.AddPolicy(Policies.AdminRights, policy => policy.RequireRole(Roles.Admin));
            options.AddPolicy(Policies.FreightForwarderRights, policy => policy.RequireRole(Roles.FreightForwarder));
        });

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = autoLogOptions!.Jwt.Issuer,
                ValidAudience = autoLogOptions!.Jwt.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(autoLogOptions.Jwt.Key)),
                ClockSkew = TimeSpan.FromSeconds(5)
            });

        return services;
    }

    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        AutoLogOptions autoLogOptions)
    {
        if (autoLogOptions!.UseInMemoryDatabase)
        {
            services.AddDbContext<AutologIdentityDbContext>(options =>
                options.UseInMemoryDatabase("AutoLogDb"));
        }
        else
        {
            services.AddDbContext<AutologIdentityDbContext>(options =>
                options.UseSqlServer(autoLogOptions.ConnectionStrings.DefaultConnection,
                    builder => builder.MigrationsAssembly(typeof(AutologIdentityDbContext).Assembly.FullName)));
        }

        return services;
    }
}
