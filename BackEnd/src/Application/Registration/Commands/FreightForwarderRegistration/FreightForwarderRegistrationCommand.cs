using System.Globalization;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.AdminRegistrationSucceedEmail;
using AutoLog.Application.Common.Exceptions;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PasswordGenerator;

namespace AutoLog.Application.Registration.Commands.FreightForwarderRegistration;

public sealed class FreightForwarderRegistrationCommand : IRequest
{
    public string RegistrationToken { get; set; } = string.Empty;

    public CompanyFreightForwarderRegistrationCommand Company { get; set; } = null!;

    public ProviderInfoFreightForwarderRegistrationCommand ProviderInfo { get; set; } = null!;

    public List<ContactFreightForwarderRegistrationCommand> Contacts { get; set; } = new();

    public CompanyLocationFreightForwarderRegistrationCommand CompanyLocation { get; set; } = null!;
}

#region Command Models
public sealed class CompanyFreightForwarderRegistrationCommand
{
    public string NameEn { get; set; } = string.Empty;

    public string LegalNumber { get; set; } = string.Empty;

    public string VATNumber { get; set; } = string.Empty;

    public string Fax { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;
}

public sealed class ProviderInfoFreightForwarderRegistrationCommand
{
    public bool Customs { get; set; }

    public bool Ocean { get; set; }

    public bool Air { get; set; }

    public bool Payment { get; set; }
}

public sealed class ContactFreightForwarderRegistrationCommand
{
    public string Name { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string JobTitle { get; set; } = string.Empty;

    public CompanyContactType ContactType { get; set; }
}

public sealed class CompanyLocationFreightForwarderRegistrationCommand
{
    public string MailingAddress { get; set; } = string.Empty;

    public string MailingApartment { get; set; } = string.Empty;

    public string MailingPostalCode { get; set; } = string.Empty;

    public string InLandAddress { get; set; } = string.Empty;

    public string InLandApartment { get; set; } = string.Empty;

    public string InLandPostalCode { get; set; } = string.Empty;

    public string Comments { get; set; } = string.Empty;
}
#endregion

public sealed class FreightForwarderRegistrationCommandHandler : IRequestHandler<FreightForwarderRegistrationCommand>
{
    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IInvitationTokenProvider _invitationTokenProvider;
    private readonly IEmailService _emailService;

    public FreightForwarderRegistrationCommandHandler(IIdentityService identityService,
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

    public async Task<Unit> Handle(FreightForwarderRegistrationCommand request, CancellationToken cancellationToken)
    {
        var isValidToken = _invitationTokenProvider.Validate(TokenPurposes.INVITATION, Roles.FreightForwarder, request.RegistrationToken);
        if (!isValidToken)
            throw new AutoLogException(ErrorCodes.CONFIRMATION_FAILED);

        var newUser = CreateUser(request, out string password);

        var result = await _identityService.CreateUserAsync(newUser);
        if (!result.Succeeded)
            throw new ValidationException(_mapper.Map<List<ValidationFailure>>(result.Errors));

        var roleResult = await _identityService.AddRoleAsync(newUser, Roles.FreightForwarder);
        if (!roleResult.Succeeded)
            throw new ValidationException(_mapper.Map<List<ValidationFailure>>(roleResult.Errors));

        await _emailService.SendRegistrationSucceedAsync(new RegistrationSucceedEmailDto
        {
            Email = newUser.Email!,
            Password = password,
        });

        return Unit.Value;
    }

    private ApplicationUser CreateUser(FreightForwarderRegistrationCommand request, out string password)
    {
        var newUser = _mapper.Map<ApplicationUser>(request.Company);
        newUser.Locale = CultureInfo.CurrentUICulture.Name;

        // Generating temporary password for user
        var passwordGenerator = new Password(true, true, true, false, 12);
        password = passwordGenerator.Next();
        newUser.PasswordHash = _userManager.PasswordHasher.HashPassword(newUser, password);

        newUser.Company = _mapper.Map<Company>(request.Company);
        newUser.Company.Contacts = _mapper.Map<List<CompanyContact>>(request.Contacts);
        newUser.Company.Location = _mapper.Map<CompanyLocation>(request.CompanyLocation);
        newUser.ProviderInfo = _mapper.Map<ProviderInfo>(request.ProviderInfo);

        return newUser;
    }
}