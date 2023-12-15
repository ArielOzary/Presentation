#See https://aka.ms/containerfastmode for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["src/Application/Application.csproj", "Application/"]
RUN true
COPY ["src/Domain/Domain.csproj", "Domain/"]
RUN true
COPY ["src/Infrastructure/Infrastructure.csproj", "Infrastructure/"]
RUN true
COPY ["src/WebAPI/WebAPI.csproj", "WebAPI/"]

RUN dotnet restore "WebAPI/WebAPI.csproj" 
COPY . .
WORKDIR "/src/src/WebAPI"
RUN dotnet build "WebAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAPI.dll"]