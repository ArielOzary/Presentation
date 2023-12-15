using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AutoLog.Application.Users.Commands.ChangePassword;

public sealed class ChangeUserPasswordCommand : IRequest
{
    public string Password { get; set; } = string.Empty;

    public string ConfirmPassword { get; set; } = string.Empty;
}

public sealed class ChangeUserPasswordCommandHandler : IRequestHandler<ChangeUserPasswordCommand>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<ApplicationUser> _userManager;

    public ChangeUserPasswordCommandHandler(ICurrentUserService currentUserService,
        UserManager<ApplicationUser> userManager)
    {
        _currentUserService = currentUserService;
        _userManager = userManager;
    }

    public async Task<Unit> Handle(ChangeUserPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUserService.UserId!)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        await _userManager.RemovePasswordAsync(user);
        await _userManager.AddPasswordAsync(user, request.Password);

        return Unit.Value;
    }
}
