using System.Globalization;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.AdminRegistrationSucceedEmail;
using AutoLog.Application.Common.Exceptions;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PasswordGenerator;

namespace AutoLog.Application.Registration.Commands.AdminRegistration;

public sealed class AdminRegistrationCommand : IRequest
{
    public string RegistrationToken { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string LegalNumber { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string JobTitle { get; set; } = string.Empty;

    public string Fax { get; set; } = string.Empty;
}

public sealed class AdminRegistrationCommandHandler : IRequestHandler<AdminRegistrationCommand>
{
    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IInvitationTokenProvider _invitationTokenProvider;
    private readonly IEmailService _emailService;

    public AdminRegistrationCommandHandler(IIdentityService identityService,
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
        IInvitationTokenProvider invitationTokenProvider,
        IEmailService emailService)
    {
        _identityService = identityService;
        _mapper = mapper;
        _userManager = userManager;
        _invitationTokenProvider = invitationTokenProvider;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(AdminRegistrationCommand request, CancellationToken cancellationToken)
    {
        var isValidToken = _invitationTokenProvider.Validate(TokenPurposes.INVITATION, Roles.Admin, request.RegistrationToken);

        if (!isValidToken)
            throw new AutoLogException(ErrorCodes.CONFIRMATION_FAILED);

        await CreateAdminAsync(request);

        return Unit.Value;
    }

    private async Task RegisterAdminAsync(string userEmail, ApplicationUser newUser, string password)
    {
        var result = await _identityService.CreateUserAsync(newUser);
        if (!result.Succeeded)
            throw new ValidationException(_mapper.Map<List<ValidationFailure>>(result.Errors));

        var roleResult = await _identityService.AddRoleAsync(newUser, Roles.Admin);
        if (!roleResult.Succeeded)
            throw new ValidationException(_mapper.Map<List<ValidationFailure>>(roleResult.Errors));

        await _emailService.SendRegistrationSucceedAsync(new RegistrationSucceedEmailDto
        {
            Email = userEmail,
            Password = password,
        });
    }

    private async Task CreateAdminAsync(AdminRegistrationCommand request)
    {
        var userEmail = _invitationTokenProvider.GetEmailFromToken(request.RegistrationToken);

        var newUser = new ApplicationUser()
        {
            PhoneNumber = request.PhoneNumber,
            Email = userEmail,
            UserName = userEmail,
            Locale = CultureInfo.CurrentUICulture.Name,
        };

        // Temporary password for admin
        var passwordGenerator = new Password(true, true, true, false, 12);
        var password = passwordGenerator.Next();
        newUser.PasswordHash = _userManager.PasswordHasher.HashPassword(newUser, password);

        newUser.Status = Domain.Enums.UserVerificationStatus.Verified;
        newUser.Company = _mapper.Map<Company>(request);

        var contact = _mapper.Map<CompanyContact>(request);
        contact.Email = userEmail;
        newUser.Company.Contacts = new List<CompanyContact>()
        {
            contact
        };

        await RegisterAdminAsync(userEmail, newUser, password);
    }
}
