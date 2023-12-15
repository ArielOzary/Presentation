using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.AdminRegistrationInviteEmail;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Security;
using MediatR;

namespace AutoLog.Application.Registration.Commands.AdminInvitation;

public sealed class AdminInvitationCommand : IRequest
{
    public string Email { get; set; } = string.Empty;
}

public sealed class AdminInvitationCommandHandler : IRequestHandler<AdminInvitationCommand>
{
    private readonly IInvitationTokenProvider _invitationTokenProvider;
    private readonly IEmailService _emailService;
    private readonly IUserValidationService _userValidationService;

    public AdminInvitationCommandHandler(IInvitationTokenProvider invitationTokenProvider,
        IEmailService emailService,
        IUserValidationService userValidationService)
    {
        _invitationTokenProvider = invitationTokenProvider;
        _emailService = emailService;
        _userValidationService = userValidationService;
    }

    public async Task<Unit> Handle(AdminInvitationCommand request, CancellationToken cancellationToken)
    {
        if (await _userValidationService.IsUserAlreadyExistsAsync(request.Email))
            throw new AutoLogException(ErrorCodes.USER_ALREADY_EXISTING);

        var userInvitationToken = new UserInvitationToken
        {
            Email = request.Email,
            Role = Roles.Admin,
        };

        var token = _invitationTokenProvider.Generate(TokenPurposes.INVITATION, userInvitationToken);
        await SendAdminInviteAsync(userInvitationToken.Email, token);

        return Unit.Value;
    }

    private async Task SendAdminInviteAsync(string email, string token)
    {
        var dto = new AdminRegistrationInviteEmailDto()
        {
            Email = email,
            Token = token,
        };

        await _emailService.SendAdminRegistrationInviteAsync(dto);
    }
}