using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.QuoteFiles.Commands.DeleteQuoteFileCommand;

public sealed class DeleteQuoteFileCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}

public sealed class DeleteQuoteFileCommandHandler : IRequestHandler<DeleteQuoteFileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<QuoteFile, int> _attachmentFileService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteQuoteFileCommandHandler(
        IAttachmentFileService<QuoteFile, int> attachmentFileService,
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _attachmentFileService = attachmentFileService;
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeleteQuoteFileCommand request, CancellationToken cancellationToken)
    {
        var quoteFile = await _context.QuoteFiles.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
                ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        if (_currentUserService.UserId != quoteFile.CreatedBy && !_currentUserService.Roles!.Contains(Roles.Admin))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        await _attachmentFileService.RemoveFileAsync(quoteFile!.Id!, cancellationToken);

        return Unit.Value;
    }
}
