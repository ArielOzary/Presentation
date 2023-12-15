using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Chats.Commands.UpdateMessage;

public sealed class UpdateMessageCommand : IRequest
{
    [JsonIgnore]
    public string Id { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;
}

public sealed class UpdateMessageCommandHandler : IRequestHandler<UpdateMessageCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateMessageCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateMessageCommand request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages
            .FirstOrDefaultAsync(message => message.Id == request.Id && message.CreatedBy == _currentUserService.UserId!, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.MESSAGE_NOT_FOUND);

        message.Body = request.Body;

        _context.Messages.Update(message);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
