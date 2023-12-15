using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.MessageFIles.Commands.DeleteMessageFileCommand;

public sealed class DeleteMessageFileCommand : IRequest
{
    public string Id { get; set; } = string.Empty;
}

public sealed class DeleteMessageFileCommandHandler : IRequestHandler<DeleteMessageFileCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<MessageFile, string> _attachmentFileService;
    private readonly ICurrentUserService _currentUserService;

    public DeleteMessageFileCommandHandler(
        IApplicationDbContext context,
        IAttachmentFileService<MessageFile, string> attachmentFileService,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _attachmentFileService = attachmentFileService;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeleteMessageFileCommand request, CancellationToken cancellationToken)
    {
        var messageFile = await _context.MessageFiles.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        if (_currentUserService.UserId != messageFile.CreatedBy && !_currentUserService.Roles!.Contains(Roles.Admin))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        await _attachmentFileService.RemoveFileAsync(messageFile.Id!, cancellationToken);

        return Unit.Value;
    }
}
