using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Chats.Queries.GetMessasges;

public sealed class GetMessagesQueryModel
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}


public sealed class GetMessagesQuery : IRequest<PaginatedList<MessageDto>>
{
    public GetMessagesQuery(GetMessagesQueryModel queryModel, string conversationId)
    {
        PageNumber = queryModel.PageNumber;
        PageSize = queryModel.PageSize;
        ConversationId = conversationId;
    }

    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public string ConversationId { get; set; } = string.Empty;
}

public sealed class GetMessagesQueryHandler : IRequestHandler<GetMessagesQuery, PaginatedList<MessageDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMessagesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<MessageDto>> Handle(GetMessagesQuery request, CancellationToken cancellationToken)
    {
        var _ = await _context.Conversations
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.ConversationId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.CHAT_NOT_FOUND);

        var messages = await _context.Messages
            .AsNoTracking()
            .Where(message => message.ConversationId == request.ConversationId)
            .OrderByDescending(x => x.LastModified)
            .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return messages;
    }
}
