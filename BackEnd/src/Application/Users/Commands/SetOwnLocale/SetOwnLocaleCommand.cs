using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Users.Commands.SetOwnLocale;

public sealed class SetOwnLocaleCommand : IRequest
{
    public string Locale { get; set; } = string.Empty;
}

public sealed class SetLocaleCommandHandler : IRequestHandler<SetOwnLocaleCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public SetLocaleCommandHandler(IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(SetOwnLocaleCommand request, CancellationToken cancellationToken)
    {
        if (Locales.Supported.All(x => x != request.Locale))
            throw new AutoLogException(ErrorCodes.UNSUPPORTED_LOCALE);

        var userId = _currentUserService.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        user.Locale = request.Locale;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
