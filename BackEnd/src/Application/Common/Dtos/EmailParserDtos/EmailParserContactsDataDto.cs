namespace AutoLog.Application.Common.Dtos.EmailParserDtos;

public class EmailParserContactsDataDto
{
    public EmailParserUpdateSenderDataDto? StatusUpdateSender { get; set; }

    public List<EmailParserUpdateReceiverDataDto>? StatusUpdateReceivers { get; set; }
}
