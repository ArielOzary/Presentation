using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.AccountDeletionEmail;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Threading;
using Newtonsoft.Json;

namespace AutoLog.Application.Users.Commands.DeleteUser;

public sealed class DeleteUserCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;
}

public sealed class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;

    public DeleteUserCommandHandler(IApplicationDbContext context,
        IEmailService emailService,
        IUserService userService)
    {
        _context = context;
        _emailService = emailService;
        _userService = userService;
    }

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company.Contacts)
            .Include(x => x.Company.Location)
                .ThenInclude(x => x!.InLandAddress)
            .Include(x => x.Company.Location)
                .ThenInclude(x => x!.MailingAddress)
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        await SoftDeleteUserAsync(request, user, cancellationToken);

        var emailDto = new AccountDeletionEmailDto
        {
            Email = user!.Email!,
            CompanyContactName = await _userService.GetContactNameAsync(user!),
        };

        _emailService.SendAccountDeletionAsync(emailDto).Forget();

        return Unit.Value;
    }

    private async Task SoftDeleteUserAsync(DeleteUserCommand request, ApplicationUser user, CancellationToken cancellationToken)
    {
        user.DeactivationReason = request.Reason;
        user.IsDeleted = true;

        user.PhoneNumber = string.Empty;
        RemoveCompanyInfo(user);
        RemoveCompanyContacts(user);
        RemoveCompanyLocation(user);

        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static void RemoveCompanyLocation(ApplicationUser user)
    {
        if (user.Company?.Location is not null)
        {
            user.Company.Location.Insurance = default;
            user.Company.Location.InLandAuthority = string.Empty;
            user.Company.Location.MadeBySystem = default;
            user.Company.Location.DestinationPortId = default;
            user.Company.Location.CustomClearance = default;
            user.Company.Location.Comments = string.Empty;

            if (user.Company.Location.MailingAddress is not null)
            {
                user.Company.Location.MailingAddress.Address = string.Empty;
                user.Company.Location.MailingAddress.Apartment = string.Empty;
                user.Company.Location.MailingAddress.PostalCode = string.Empty;
            }

            if (user.Company.Location.InLandAddress is not null)
            {
                user.Company.Location.InLandAddress.Address = string.Empty;
                user.Company.Location.InLandAddress.Apartment = string.Empty;
                user.Company.Location.InLandAddress.PostalCode = string.Empty;
            }
        }
    }

    private static void RemoveCompanyContacts(ApplicationUser user)
    {
        if (user.Company?.Contacts is not null)
            foreach (var item in user.Company?.Contacts!)
            {
                item.Fax = string.Empty;
                item.PhoneNumber = string.Empty;
                item.Name = string.Empty;
                item.Email = string.Empty;
                item.JobTitle = string.Empty;
            }
    }

    private static void RemoveCompanyInfo(ApplicationUser user)
    {
        if (user.Company is not null)
        {
            user.Company.Email = string.Empty;
            user.Company.IndustryTypeId = default;
            user.Company.VATNumber = string.Empty;
            user.Company.LegalNumber = string.Empty;
            user.Company.Fax = string.Empty;
            user.Company.NameEn = "Deleted Company";
            user.Company.NameHe = string.Empty;
        }
    }
}
