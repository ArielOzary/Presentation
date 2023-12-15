using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.VerificationResultRejectedEmail;
using AutoLog.Application.Common.Dtos.Emails.VerificationResultSucceedEmail;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Users.Commands.SetVerificationStatus;
using AutoLog.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Threading;
using Newtonsoft.Json;

namespace AutoLog.Application.Users.Commands.SetActivationStatus;

public sealed class SetUserVerificationStatusCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public UserVerificationStatus Status { get; set; }
}

public sealed class SetUserVerificationStatusCommandHandler : IRequestHandler<SetUserVerificationStatusCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IUserIdTokenProvider _userIdTokenProvider;

    public SetUserVerificationStatusCommandHandler(IApplicationDbContext context,
        IEmailService emailService,
        IUserIdTokenProvider userIdTokenProvider)
    {
        _context = context;
        _emailService = emailService;
        _userIdTokenProvider = userIdTokenProvider;
    }

    public async Task<Unit> Handle(SetUserVerificationStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        user.Status = request.Status;

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        var companyName = await _context.Companies
            .Where(x => x.UserId == request.UserId)
            .Select(x => x.NameEn)
            .FirstOrDefaultAsync(cancellationToken);

        var companyContacts = await _context.Companies
            .Where(x => x.UserId == request.UserId)
            .Select(x => x.Contacts)
            .FirstOrDefaultAsync(cancellationToken);
        var contactName = companyContacts?.FirstOrDefault(x => x.ContactType == CompanyContactType.Basic)?.Name;

        var verificationToken = _userIdTokenProvider.Generate(TokenPurposes.VERIFICATION_STATUS, user.Id);
        SendVerificationNotificationAsync(new UserVerificationData
        {
            Status = user.Status,
            Email = user.Email!,
            ContactName = contactName!,
            CompanyName = companyName!,
            VerificationToken = verificationToken
        }).Forget();

        return Unit.Value;
    }

    private async Task SendVerificationNotificationAsync(UserVerificationData verificationData)
    {
        switch (verificationData.Status)
        {
            case UserVerificationStatus.Verified:
                await _emailService.SendVerificationResultSucceedAsync(new VerificationResultSucceedEmailDto
                {
                    Email = verificationData.Email,
                    FirstName = verificationData.ContactName,
                    CompanyName = verificationData.CompanyName,
                });
                break;
            case UserVerificationStatus.Rejected:
                await _emailService.SendVerificationResultRejectedAsync(new VerificationResultRejectedEmailDto
                {
                    Email = verificationData.Email,
                    FirstName = verificationData.ContactName,
                    CompanyName = verificationData.CompanyName,
                    Token = verificationData.VerificationToken
                });
                break;
            default:
                // All cases are handled
                break;
        }
    }
}
