using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Users.Commands.DeleteUser;
using MediatR;

namespace AutoLog.Application.FreightForwarders.Commands.DeleteOwnProfile;

public sealed class DeleteOwnFreightForwarderProfile : IRequest
{
}

public sealed class DeleteOwnFreightForwarderProfileHandler : IRequestHandler<DeleteOwnFreightForwarderProfile>
{
    const string REASON = "You deleted the Profile.";

    private readonly IMediator _mediatr;
    private readonly ICurrentUserService _currentUserService;

    public DeleteOwnFreightForwarderProfileHandler(IMediator mediatr,
        ICurrentUserService currentUserService)
    {
        _mediatr = mediatr;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(DeleteOwnFreightForwarderProfile request, CancellationToken cancellationToken)
    {
        var command = new DeleteUserCommand
        {
            UserId = _currentUserService.UserId!,
            Reason = REASON
        };

        await _mediatr.Send(command, cancellationToken);

        return Unit.Value;
    }
}
