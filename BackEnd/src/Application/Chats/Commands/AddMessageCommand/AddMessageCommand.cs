using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Chats.Commands.AddMessageCommand;

public sealed class AddMessageCommand : IRequest<MessageDto>
{
    public string ChatId { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}

public sealed class AddMessageCommandHandler : IRequestHandler<AddMessageCommand, MessageDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public AddMessageCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _context = context;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<MessageDto> Handle(AddMessageCommand request, CancellationToken cancellationToken)
    {
        var chat = await _context.Conversations
            .Include(chat => chat.Messages)
            .FirstOrDefaultAsync(chat => chat.Id == request.ChatId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.CHAT_NOT_FOUND);

        var message = new Message
        {
            Body = request.Message,
            UserId = _currentUserService.UserId!
        };

        chat.Messages.Add(message);

        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<MessageDto>(message);
    }
}