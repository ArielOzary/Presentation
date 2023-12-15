using AutoLog.Infrastructure.Persistence;
using Serilog;
using Serilog.Ui.Web;
using WebAPI;
using WebAPI.Filters;
using WebAPI.Hubs;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting the service");
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddApplicationServices();
    builder.Services.AddInfrastructureServices(builder.Configuration);
    builder.Services.AddWebAPIServices(builder.Configuration);

    builder.ConfigLogging();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseMigrationsEndPoint();
        app.UseHttpsRedirection();
    }
    else
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    // Initialise and seed database
    using var scope = app.Services.CreateScope();
    var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
    await initialiser.InitialiseAsync();
    await initialiser.SeedAsync();

    app.UseCors("AllowAnyOrigin");
    app.UseHealthChecks("/health");

    app.UseOpenApi();
    app.UseSwaggerUi3();
    app.UseRequestLocalization();
    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseSerilogUi(options =>
    {
        options.Authorization.AuthenticationType = AuthenticationType.Jwt;
        options.Authorization.Filters = new[]
        {
            new SerilogUIAuthFilter(app.Services)
        };
        options.RoutePrefix = "logs";
    });

    app.UseOutputCache();

    app.MapHub<ChatHub>("/chatHub");
    app.UseWebSockets();

    app.MapControllers();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}