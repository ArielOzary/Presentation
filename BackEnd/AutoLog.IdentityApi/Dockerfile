#See https://aka.ms/customizecontainer for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["AutoLog.IdentityApi/AutoLog.IdentityApi.csproj", "AutoLog.IdentityApi/"]
RUN dotnet restore "AutoLog.IdentityApi/AutoLog.IdentityApi.csproj"
COPY . .
WORKDIR "/src/AutoLog.IdentityApi"
RUN dotnet build "AutoLog.IdentityApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AutoLog.IdentityApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AutoLog.IdentityApi.dll"]