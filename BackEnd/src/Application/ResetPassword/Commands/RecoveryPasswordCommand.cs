using AutoLog.Application.Common.Dtos.Emails.TemporaryRecoveryLinkEmail;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AutoLog.Application.ResetPassword.Commands;

public sealed class RecoveryPasswordCommand : IRequest
{
    public string Email { get; set; } = string.Empty;
}

public sealed class RecoveryPasswordCommandHandler : IRequestHandler<RecoveryPasswordCommand>
{
    private const string DefaultName = "User";

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;

    public RecoveryPasswordCommandHandler(UserManager<ApplicationUser> userManager,
        IEmailService emailService,
        IUserService userService)
    {
        _userManager = userManager;
        _emailService = emailService;
        _userService = userService;
    }

    public async Task<Unit> Handle(RecoveryPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is not null && !user.IsDeactivated)
        {
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var contactName = await _userService.GetContactNameAsync(user);

            await _emailService.SendTemporaryRecoveryLinkEmailAsync(new TemporaryRecoveryLinkEmailDto
            {
                Email = request.Email,
                FirstName = contactName ?? DefaultName,
                Token = resetToken,
            });
        }

        return Unit.Value;
    }
}
