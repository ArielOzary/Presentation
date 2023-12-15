using System.Data;
using AutoLog.Infrastructure.Configurations;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;
using Serilog.Ui.MsSqlServerProvider;
using Serilog.Ui.Web;

namespace WebAPI;

public static class ConfigureLogging
{
    public static IServiceCollection ConfigLogging(this WebApplicationBuilder builder)
    {
        var config = GetAutoLogConfig(builder.Configuration);

        builder.UseSerilog(config);

        builder.Services.AddSerilogUi(options =>
            options.UseSqlServer(config.ConnectionStrings.DefaultConnection, "_logs"));

        return builder.Services;
    }

    private static void UseSerilog(this WebApplicationBuilder builder, AutoLogConfig config)
    {
        var minimumLevel = GetLogEventLevel(config.Logging.MinimumLogLevel);

        var colOptions = new ColumnOptions();
        colOptions.Store.Remove(StandardColumn.MessageTemplate);

        colOptions.AdditionalColumns = new List<SqlColumn>
        {
            new SqlColumn { DataType = SqlDbType.VarChar, ColumnName = "RequestPath" },
            new SqlColumn { DataType = SqlDbType.VarChar, ColumnName = "SourceContext" },
        };

        builder.Host.UseSerilog((context, configuration) => configuration
            .MinimumLevel.Is(minimumLevel)
            .MinimumLevel.Override("Microsoft", GetLogEventLevel(config.Logging.Microsoft))
            .MinimumLevel.Override("System", GetLogEventLevel(config.Logging.System))
            .MinimumLevel.Override("Microsoft.AspNetCore.Authentication", GetLogEventLevel(config.Logging.MicrosoftAspNetCoreAuthentication))
            .MinimumLevel.Override("Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerHandler", GetLogEventLevel(config.Logging.MicrosoftAspNetCoreAuthenticationJwtBearerJwtBearerHandler))
            .Enrich.FromLogContext()
            .WriteTo.Async(
                x => x.MSSqlServer(
                    connectionString: config.ConnectionStrings.DefaultConnection,
                    columnOptions: colOptions,
                    restrictedToMinimumLevel: minimumLevel,
                    sinkOptions: new MSSqlServerSinkOptions { TableName = "_logs", AutoCreateSqlTable = true }))
            .WriteTo.Console());
    }

    private static AutoLogConfig GetAutoLogConfig(IConfiguration configuration)
    {
        var config = new AutoLogConfig();
        configuration.GetSection(AutoLogConfig.ConfigName).Bind(config);

        return config;
    }

    private static LogEventLevel GetLogEventLevel(string logLevel)
    {
        var minimumLogLevel =
            string.IsNullOrWhiteSpace(logLevel) ?
        LogEventLevel.Information : Enum.Parse<LogEventLevel>(logLevel);

        return minimumLogLevel;
    }
}
