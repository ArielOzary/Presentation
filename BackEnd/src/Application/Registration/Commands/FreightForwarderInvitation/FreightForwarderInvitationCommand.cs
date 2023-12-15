using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.FreightForwarderInvitationEmail;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Security;
using MediatR;

namespace AutoLog.Application.Registration.Commands.FreightForwarderInvitation;

public sealed class FreightForwarderInvitationCommand : IRequest
{
    public string Email { get; set; } = string.Empty;
}

public sealed class FreightForwarderInvitationCommandHandler : IRequestHandler<FreightForwarderInvitationCommand>
{
    private readonly IInvitationTokenProvider _invitationTokenProvider;
    private readonly IEmailService _emailService;
    private readonly IUserValidationService _userValidationService;

    public FreightForwarderInvitationCommandHandler(IInvitationTokenProvider invitationTokenProvider,
        IEmailService emailService,
        IUserValidationService userValidationService)
    {
        _invitationTokenProvider = invitationTokenProvider;
        _emailService = emailService;
        _userValidationService = userValidationService;
    }

    public async Task<Unit> Handle(FreightForwarderInvitationCommand request, CancellationToken cancellationToken)
    {
        if (await _userValidationService.IsUserAlreadyExistsAsync(request.Email))
            throw new AutoLogException(ErrorCodes.USER_ALREADY_EXISTING);

        var userInvitationToken = new UserInvitationToken
        {
            Email = request.Email,
            Role = Roles.FreightForwarder,
        };

        var token = _invitationTokenProvider.Generate(TokenPurposes.INVITATION, userInvitationToken);
        await SendFreightForwarderInviteAsync(userInvitationToken.Email, token);

        return Unit.Value;
    }

    private async Task SendFreightForwarderInviteAsync(string email, string token)
    {
        var dto = new FreightForwarderInvitationEmailDto()
        {
            Email = email,
            Token = token,
        };

        await _emailService.SendFFRegistrationInviteAsync(dto);
    }
}
