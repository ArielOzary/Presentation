using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;

namespace AutoLog.Application.ShipmentFiles.Queries;

public sealed class GetShipmentFileByIdQuery : IRequest<FileDto>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetShipmentFileByIdQueryHandler : IRequestHandler<GetShipmentFileByIdQuery, FileDto>
{
    private readonly IAttachmentFileService<ShipmentFile, string> _attachmentFileService;

    public GetShipmentFileByIdQueryHandler(IAttachmentFileService<ShipmentFile, string> attachmentFileService)
    {
        _attachmentFileService = attachmentFileService;
    }

    public async Task<FileDto> Handle(GetShipmentFileByIdQuery request, CancellationToken cancellationToken)
    {
        return await _attachmentFileService.GetFileAsync(request.Id, cancellationToken);
    }
}
