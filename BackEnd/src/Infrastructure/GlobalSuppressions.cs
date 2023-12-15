// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Style", "IDE0161:Convert to file-scoped namespace", Justification = "<Pending>", Scope = "namespace", Target = "~N:AutoLog.Infrastructure.Persistence.Migrations")]
[assembly: SuppressMessage("Usage", "CA2254:Template should be a static expression", Justification = "<Pending>", Scope = "member", Target = "~M:AutoLog.Infrastructure.ExternalClients.EuroExchangeRatesClient.ECBEuroExchangeRatesHttpClient.GetAsync``1(System.String,System.String)~System.Threading.Tasks.Task{``0}")]
[assembly: SuppressMessage("Usage", "CA2254:Template should be a static expression", Justification = "<Pending>", Scope = "member", Target = "~M:AutoLog.Infrastructure.MassTransit.Consumers.ShipmentStatusConsumer.Consume(MassTransit.ConsumeContext{AutoLog.Application.Common.MassTransit.Requests.NewShipmentStatusInfoRequest})~System.Threading.Tasks.Task")]
[assembly: SuppressMessage("Usage", "CA2254:Template should be a static expression", Justification = "<Pending>", Scope = "member", Target = "~M:AutoLog.Infrastructure.Services.PortsSeeder.SeedAsync(System.Threading.CancellationToken)~System.Threading.Tasks.Task")]
[assembly: SuppressMessage("Style", "IDE1006:Naming Styles", Justification = "<Pending>", Scope = "member", Target = "~M:AutoLog.Infrastructure.MassTransit.Consumers.ShipmentStatusConsumer.HandleBookingStatusAsync(AutoLog.Application.Common.Dtos.EmailParserDtos.EmailParserShipmentDataDto,System.Threading.CancellationToken)~System.Threading.Tasks.Task")]
[assembly: SuppressMessage("Style", "IDE1006:Naming Styles", Justification = "<Pending>", Scope = "member", Target = "~M:AutoLog.Infrastructure.Services.ParserHandlerService.HandleBookingStatusAsync(AutoLog.Application.Common.Dtos.EmailParserDtos.EmailParserShipmentDataDto,System.Threading.CancellationToken)~System.Threading.Tasks.Task")]
