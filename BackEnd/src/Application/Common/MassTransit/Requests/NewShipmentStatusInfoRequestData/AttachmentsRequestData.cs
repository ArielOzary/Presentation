using AutoLog.Application.Common.Dtos.EmailParserDtos;

namespace AutoLog.Application.Common.MassTransit.Requests.NewShipmentStatusInfoRequestData;

public sealed class AttachmentsRequestData
{
    public List<ExcelRequestTable>? ExcelTables { get; set; }

    public EmailParserShipmentDataDto? ShipmentData { get; set; }

    public List<EmailParserGoodsDataDto>? GoodsData { get; set; }

    public ContactsRequestData? Contacts { get; set; }
}
