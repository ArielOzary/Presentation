using AutoLog.Application.Common.Dtos.EmailParserDtos;

namespace AutoLog.Application.Common.MassTransit.Requests.NewShipmentStatusInfoRequestData;

public sealed class EmailRequestData
{
    public List<EmailParserGoodsDataDto>? GoodsData { get; set; }

    public EmailParserShipmentDataDto? ShipmentData { get; set; }

    public EmailParserContactsDataDto? ContactsData { get; set; }
}
