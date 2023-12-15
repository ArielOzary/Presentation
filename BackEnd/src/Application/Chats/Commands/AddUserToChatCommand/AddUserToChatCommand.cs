using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Chats.Commands.AddUserToChatCommand;

public sealed class AddUserToChatCommand : IRequest
{
    public string ChatId { get; set; } = string.Empty;
}

public sealed class AddUserToChatCommandHandler : IRequestHandler<AddUserToChatCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AddUserToChatCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(AddUserToChatCommand request, CancellationToken cancellationToken)
    {
        // Check if user is client and has this shipment
        if (_currentUserService.Roles!.Contains(Roles.Client))
        {
            var _ = await _context.Conversations
                .Where(chat => chat.Id == request.ChatId)
                .FirstOrDefaultAsync(chat => chat.Shipment.UserId == _currentUserService.UserId, cancellationToken)
                ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);
        }

        // Check if user is freight forwarder and has this shipment
        if (_currentUserService.Roles!.Contains(Roles.FreightForwarder))
        {
            var _ = await _context.Conversations
                .Where(chat => chat.Id == request.ChatId)
                .FirstOrDefaultAsync(chat => chat.Shipment.CompanyId == _currentUserService.CompanyId, cancellationToken)
                ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);
        }

        var chat = await _context.Conversations
            .Include(x => x.Users)
            .FirstOrDefaultAsync(chat => chat.Id == request.ChatId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.CHAT_NOT_FOUND);

        var currentUser = await _context.Users
            .FirstOrDefaultAsync(user => user.Id == _currentUserService.UserId, cancellationToken);

        chat.Users.Add(currentUser!);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}