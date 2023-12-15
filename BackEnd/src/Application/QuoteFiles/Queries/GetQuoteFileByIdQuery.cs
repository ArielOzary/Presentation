using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;

namespace AutoLog.Application.QuoteFiles.Queries;

public sealed class GetQuoteFileByIdQuery : IRequest<FileDto>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetQuoteFileByIdQueryHandler : IRequestHandler<GetQuoteFileByIdQuery, FileDto>
{
    private readonly IAttachmentFileService<QuoteFile, int> _attachmentFileService;

    public GetQuoteFileByIdQueryHandler(IAttachmentFileService<QuoteFile, int> attachmentFileService)
    {
        _attachmentFileService = attachmentFileService;
    }

    public async Task<FileDto> Handle(GetQuoteFileByIdQuery request, CancellationToken cancellationToken)
    {
        return await _attachmentFileService.GetFileAsync(request.Id, cancellationToken);
    }
}
