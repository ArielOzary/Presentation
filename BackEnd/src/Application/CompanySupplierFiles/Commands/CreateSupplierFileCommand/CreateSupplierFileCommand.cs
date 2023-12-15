using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.CompanySupplierFiles.Commands.CreateSupplierFileCommand;

public sealed class CreateSupplierFileCommand : IRequest
{
    public int SupplierId { get; set; }

    public List<IFormFile> Files { get; set; } = new();
}

public sealed class CreateSupplierFileCommandHandler : IRequestHandler<CreateSupplierFileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<CompanySupplierFile, int> _attachmentFileService;

    public CreateSupplierFileCommandHandler(
        IApplicationDbContext context,
        IAttachmentFileService<CompanySupplierFile, int> attachmentFileService)
    {
        _context = context;
        _attachmentFileService = attachmentFileService;
    }

    public async Task<Unit> Handle(CreateSupplierFileCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _context.CompanySuppliers
            .FirstOrDefaultAsync(x => x.Id == request.SupplierId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SUPPLIER_NOT_FOUND);

        await _attachmentFileService.AddFilesAsync(supplier.Id, request.Files, cancellationToken);

        return Unit.Value;
    }
}