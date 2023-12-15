using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.CompanySupplierFiles.Commands.DeleteSupplierFileCommand;

public sealed class DeleteCompanySupplierFileCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}

public sealed class DeleteCompanySupplierFileCommandHandler : IRequestHandler<DeleteCompanySupplierFileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<CompanySupplierFile, int> _attachmentFileService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteCompanySupplierFileCommandHandler(
        IAttachmentFileService<CompanySupplierFile, int> attachmentFileService,
        ICurrentUserService currentUserService,
        IApplicationDbContext context)
    {
        _attachmentFileService = attachmentFileService;
        _currentUserService = currentUserService;
        _context = context;
    }

    public async Task<Unit> Handle(DeleteCompanySupplierFileCommand request, CancellationToken cancellationToken)
    {
        var supplierFile = await _context.CompanySupplierFiles
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        if (_currentUserService.UserId != supplierFile.CreatedBy && !_currentUserService.Roles!.Contains(Roles.Admin))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        await _attachmentFileService.RemoveFileAsync(supplierFile.Id!, cancellationToken);

        return Unit.Value;
    }
}
