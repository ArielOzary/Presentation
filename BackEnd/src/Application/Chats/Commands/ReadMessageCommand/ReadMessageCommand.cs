using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Chats.Commands.ReadMessageCommand;

public sealed class ReadMessageCommand : IRequest
{
    [JsonIgnore]
    public string MessageId { get; set; } = string.Empty;
}

public sealed class ReadMessageCommandHandler : IRequestHandler<ReadMessageCommand>
{
    private readonly IApplicationDbContext _context;

    public ReadMessageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(ReadMessageCommand request, CancellationToken cancellationToken)
    {
        await _context.Messages.Where(message => message.Id == request.MessageId)
            .ExecuteUpdateAsync(message => message.SetProperty(message => message.Unread, false), cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

