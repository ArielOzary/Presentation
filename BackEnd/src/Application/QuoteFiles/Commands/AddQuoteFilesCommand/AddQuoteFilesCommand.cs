using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.QuoteFiles.Commands.AddQuoteFilesCommand;

public sealed class AddQuoteFilesCommand : IRequest
{
    public int QuoteId { get; set; }

    public List<IFormFile> Files { get; set; } = new();
}

public sealed class AddQuoteFilesCommandHandler : IRequestHandler<AddQuoteFilesCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<QuoteFile, int> _attachmentFileService;

    public AddQuoteFilesCommandHandler(
        IApplicationDbContext context,
        IAttachmentFileService<QuoteFile, int> attachmentFileService)
    {
        _context = context;
        _attachmentFileService = attachmentFileService;
    }

    public async Task<Unit> Handle(AddQuoteFilesCommand request, CancellationToken cancellationToken)
    {
        var quote = await _context.Quotes.FirstOrDefaultAsync(x => x.Id == request.QuoteId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.QUOTE_NOT_FOUND);

        await _attachmentFileService.AddFilesAsync(quote.Id, request.Files, cancellationToken);

        return Unit.Value;
    }
}

