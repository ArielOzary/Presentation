using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.VerificationResultSucceedEmail;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Enums;
using AutoLog.Domain.Events.Clients;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Threading;

namespace AutoLog.Application.Clients.EventHandlers;

public sealed class ClientVerifiedEventHandler : INotificationHandler<ClientVerifiedEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IUserIdTokenProvider _userIdTokenProvider;
    private readonly IEmailService _emailService;

    public ClientVerifiedEventHandler(IApplicationDbContext context,
        IUserIdTokenProvider userIdTokenProvider,
        IEmailService emailService)
    {
        _context = context;
        _userIdTokenProvider = userIdTokenProvider;
        _emailService = emailService;
    }

#pragma warning disable CS8601 // Possible null reference assignment.
    public async Task Handle(ClientVerifiedEvent notification, CancellationToken cancellationToken)
    {
        if (notification.User.Status == UserVerificationStatus.Pending)
        {
            notification.User.Status = UserVerificationStatus.Verified;
            _context.Users.Update(notification.User);

            var companyName = await _context.Companies
                .Where(x => x.UserId == notification.User.Id).Select(x => x.NameEn)
                .FirstOrDefaultAsync(cancellationToken);
            var companyContacts = await _context.Companies
                .Where(x => x.UserId == notification.User.Id)
                .Select(x => x.Contacts).FirstOrDefaultAsync(cancellationToken);
            var contactName = companyContacts?.FirstOrDefault(x => x.ContactType == CompanyContactType.Basic)?.Name;

            var verificationToken = _userIdTokenProvider.Generate(TokenPurposes.VERIFICATION_STATUS, notification.User.Id);
            _emailService.SendVerificationResultSucceedAsync(new VerificationResultSucceedEmailDto
            {
                Email = notification.User.Email,
                FirstName = contactName,
                CompanyName = companyName,
            }).Forget();
        }
    }
#pragma warning restore CS8601 // Possible null reference assignment.
}
