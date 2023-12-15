namespace AutoLog.Infrastructure.Configurations;

public sealed class RabbitMqConfig
{
    public static string ConfigName => "RabbitMq";

    public string ConnectionString { get; set; } = string.Empty;

    public string AvailableQuotesCalculationQueueName { get; set; } = string.Empty;

    public string AvailableQuotesCalculationExchangeName { get; set; } = string.Empty;

    public string CustomRequestedQuotesQueueName { get; set; } = string.Empty;

    public string CustomRequestedQuotesExchangeName { get; set; } = string.Empty;

    public string ShipmentStatusQueueName { get; set; } = string.Empty;
}
