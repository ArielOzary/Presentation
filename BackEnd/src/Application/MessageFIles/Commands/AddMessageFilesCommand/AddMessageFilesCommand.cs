using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.MessageFIles.Commands.AddMessageFilesCommand;

public sealed class AddMessageFilesCommand : IRequest<MessageDto>
{
    public string ConversationId { get; set; } = string.Empty;

    public List<IFormFile> Files { get; set; } = new();
}

public sealed class AddMessageFilesCommandHandler : IRequestHandler<AddMessageFilesCommand, MessageDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IAttachmentFileService<MessageFile, string> _attachmentFileService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public AddMessageFilesCommandHandler(
        IApplicationDbContext context,
        IAttachmentFileService<MessageFile, string> attachmentFileService,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _context = context;
        _attachmentFileService = attachmentFileService;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<MessageDto> Handle(AddMessageFilesCommand request, CancellationToken cancellationToken)
    {
        var chat = await _context.Conversations.FirstOrDefaultAsync(x => x.Id == request.ConversationId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.CHAT_NOT_FOUND);

        var message = new Message
        {
            UserId = _currentUserService.UserId!
        };

        chat.Messages.Add(message);

        await _context.SaveChangesAsync(cancellationToken);

        await _attachmentFileService.AddFilesAsync(message.Id, request.Files, cancellationToken);

        return _mapper.Map<MessageDto>(message);
    }
}
