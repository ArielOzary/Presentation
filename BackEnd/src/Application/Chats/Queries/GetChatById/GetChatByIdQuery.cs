using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Chats.Queries.GetChatById;

public sealed class GetChatByIdQuery : IRequest<ConversationDto?>
{
    [JsonIgnore]
    public string ChatId { get; set; } = string.Empty;
}

public sealed class GetChatByIdQueryHandler : IRequestHandler<GetChatByIdQuery, ConversationDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetChatByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ConversationDto?> Handle(GetChatByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Conversations
            .AsNoTracking()
            .Where(chat => chat.Id == request.ChatId)
            .ProjectTo<ConversationDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.CHAT_NOT_FOUND);

        var messages = await _context.Messages
            .AsNoTracking()
            .Where(message => message.ConversationId == request.ChatId)
            .OrderByDescending(x => x.LastModified)
            .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        result.Messages = messages;

        return result;
    }
}
