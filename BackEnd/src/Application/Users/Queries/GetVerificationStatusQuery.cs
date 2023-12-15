using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Users.Queries;

public sealed class GetVerificationStatusQuery : IRequest<UserVerificationStatus>
{
    public string Token { get; set; } = string.Empty;
}

public sealed class GetVerificationStatusQueryHandler : IRequestHandler<GetVerificationStatusQuery, UserVerificationStatus>
{
    private readonly IApplicationDbContext _context;
    private readonly IUserIdTokenProvider _userIdTokenProvider;

    public GetVerificationStatusQueryHandler(IApplicationDbContext context,
        IUserIdTokenProvider userIdTokenProvider)
    {
        _context = context;
        _userIdTokenProvider = userIdTokenProvider;
    }

    public async Task<UserVerificationStatus> Handle(GetVerificationStatusQuery request, CancellationToken cancellationToken)
    {
        var isValidToken = _userIdTokenProvider.Validate(TokenPurposes.VERIFICATION_STATUS, request.Token);

        if (!isValidToken)
            return UserVerificationStatus.Rejected;

        var userId = _userIdTokenProvider.GetUserIdFromToken(request.Token);
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

        return user is null ? UserVerificationStatus.Rejected : user.Status;
    }
}
