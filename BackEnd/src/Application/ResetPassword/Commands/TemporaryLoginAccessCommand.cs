using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AutoLog.Application.ResetPassword.Commands;

public sealed class TemporaryLoginAccessCommand : IRequest<Common.Dtos.TokenResultDto>
{
    public string Token { get; set; } = string.Empty;
}

public sealed class TemporaryLoginAccessCommandHandler : IRequestHandler<TemporaryLoginAccessCommand, Common.Dtos.TokenResultDto>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IAutoLogResetPasswordConfirmationTokenProvider _resetPasswordTokenProvider;
    private readonly IJwtProvider _jwtProvider;

    public TemporaryLoginAccessCommandHandler(UserManager<ApplicationUser> userManager,
        IAutoLogResetPasswordConfirmationTokenProvider resetPasswordConfirmationTokenProvider,
        IJwtProvider jwtProvider)
    {
        _userManager = userManager;
        _resetPasswordTokenProvider = resetPasswordConfirmationTokenProvider;
        _jwtProvider = jwtProvider;
    }

    public async Task<Common.Dtos.TokenResultDto> Handle(TemporaryLoginAccessCommand request, CancellationToken cancellationToken)
    {
        var userId = _resetPasswordTokenProvider.GetUserIdFromToken(request.Token);

        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        var confirmResult = await _userManager
            .VerifyUserTokenAsync(user, _resetPasswordTokenProvider.Name, UserManager<ApplicationUser>.ResetPasswordTokenPurpose, request.Token);

        if (!confirmResult)
            throw new AutoLogException(ErrorCodes.CONFIRMATION_FAILED);

        var token = await _jwtProvider.GenerateAsync(user);

        return token;
    }
}
