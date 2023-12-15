namespace AutoLog.Application.Common.Dtos.Emails.NoticeOfArrival;

public sealed class NoticeOfArrivalEmailDataDto
{
    public string ShipmentName { get; set; } = string.Empty;

    public string ArrivalDate { get; set; } = string.Empty;

    public string ClientsName { get; set; } = string.Empty;
}
