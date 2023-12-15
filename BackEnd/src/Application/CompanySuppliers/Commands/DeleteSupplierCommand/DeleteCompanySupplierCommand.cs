using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.CompanySuppliers.Commands.DeleteSupplierCommand;

public sealed class DeleteCompanySupplierCommand : IRequest
{
    public int Id { get; set; }
}

public sealed class DeleteCompanySupplierCommandHandler : IRequestHandler<DeleteCompanySupplierCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<CompanySupplierFile, int> _attachmentFileService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteCompanySupplierCommandHandler(IApplicationDbContext context,
        IAttachmentFileService<CompanySupplierFile, int> attachmentFileService,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _attachmentFileService = attachmentFileService;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeleteCompanySupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _context.CompanySuppliers
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SUPPLIER_NOT_FOUND);

        if (_currentUserService.UserId != supplier.CreatedBy && !_currentUserService.Roles!.Contains(Roles.Admin))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        var files = await _context.CompanySupplierFiles.Where(x => x.CompanySupplierId == request.Id).ToListAsync(cancellationToken);

        // Removing suppliers file with him
        if (files is not null && files.Any())
        {
            foreach (var file in files)
            {
                await _attachmentFileService.RemoveFileAsync(file.Id!, cancellationToken);
            }

        }

        _context.CompanySuppliers.Remove(supplier);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
