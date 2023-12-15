using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;

namespace AutoLog.Application.CompanySupplierFiles.Queries.GetSupplierFileByIdQuery;

public sealed class GetSupplierFileByIdQuery : IRequest<FileDto>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetSupplierFileByIdQueryHandler : IRequestHandler<GetSupplierFileByIdQuery, FileDto>
{
    private readonly IAttachmentFileService<CompanySupplierFile, int> _attachmentFileService;

    public GetSupplierFileByIdQueryHandler(IAttachmentFileService<CompanySupplierFile, int> attachmentFileService)
    {
        _attachmentFileService = attachmentFileService;
    }

    public async Task<FileDto> Handle(GetSupplierFileByIdQuery request, CancellationToken cancellationToken)
    {
        return await _attachmentFileService.GetFileAsync(request.Id, cancellationToken);
    }
}
