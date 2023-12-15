using AutoLog.IdentityApi;
using AutoLog.IdentityApi.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddServices(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowAnyOrigin");

app.UseSwagger();
app.UseSwaggerUI();

app.UseRequestLocalization();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseAuthorization();

app.UseMiddleware<GeneralExceptionMiddleware>();

app.MapControllers();

app.Run();
