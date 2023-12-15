using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Chats.Commands.ReadMessagesRangeCommand;

public sealed class ReadMessagesRangeCommand : IRequest<ReadMessagesRangeResult>
{
    [JsonIgnore]
    public string ChatId { get; set; } = string.Empty;

    public List<string> MessagesIds { get; set; } = new();
}

public sealed class ReadMessagesRangeResult
{
    public List<string> MessagesIds { get; set; } = new();

    public bool Unread { get; set; } 
}

public sealed class ReadMessagesRangeCommandHandler : IRequestHandler<ReadMessagesRangeCommand, ReadMessagesRangeResult>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ReadMessagesRangeCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<ReadMessagesRangeResult> Handle(ReadMessagesRangeCommand request, CancellationToken cancellationToken)
    {
        if (!_context.Conversations.Any(x => x.Id == request.ChatId))
            throw new AutoLogException(ErrorCodes.CHAT_NOT_FOUND);

        if (!request.MessagesIds.Any())
            throw new AutoLogException(ErrorCodes.MESSAGE_IDS_ARE_EMPTY);

        var messages = _context.Messages
            .Where(message => request.MessagesIds.Contains(message.Id) && message.UserId != _currentUserService.UserId)
            .Where(message => message.ConversationId == request.ChatId);

        await messages
            .OrderBy(message => message.Created)
            .ExecuteUpdateAsync(messages => messages.SetProperty(b => b.Unread, false), cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);

        var isUnread = await _context.Messages
            .Where(message => message.Unread && message.UserId != _currentUserService.UserId)
            .Where(message => message.ConversationId == request.ChatId)
            .AnyAsync();

        return new ReadMessagesRangeResult
        {
            MessagesIds = request.MessagesIds,
            Unread = isUnread
        };
    }
}
