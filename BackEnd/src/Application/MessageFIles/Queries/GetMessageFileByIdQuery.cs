using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;

namespace AutoLog.Application.MessageFIles.Queries;

public sealed class GetMessageFileByIdQuery : IRequest<FileDto>
{
    public string Id { get; set; } = string.Empty;
}

public class GetMessageFileByIdQueryHandler : IRequestHandler<GetMessageFileByIdQuery, FileDto>
{
    private readonly IAttachmentFileService<MessageFile, string> _attachmentFileService;

    public GetMessageFileByIdQueryHandler(IAttachmentFileService<MessageFile, string> attachmentFileService)
    {
        _attachmentFileService = attachmentFileService;
    }

    public async Task<FileDto> Handle(GetMessageFileByIdQuery request, CancellationToken cancellationToken)
    {
        return await _attachmentFileService.GetFileAsync(request.Id, cancellationToken);
    }
}
