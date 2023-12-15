using System.Globalization;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.VerificationInformationEmail;
using AutoLog.Application.Common.Dtos.Registration;
using AutoLog.Application.Common.Exceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualStudio.Threading;

namespace AutoLog.Application.Registration.Commands.ClientRegistration;

public sealed class ClientRegistrationCommand : IRequest<ClientRegistrationResponseDto>
{
    public CompanyClientRegistrationCommand Company { get; set; } = null!;

    public ContactClientRegistrationCommand Contact { get; set; } = null!;

    public CompanyLocationClientRegistrationCommand CompanyLocation { get; set; } = null!;
}

#region Command Models
public sealed class CompanyClientRegistrationCommand
{
    public string NameEn { get; set; } = string.Empty;

    public string NameHe { get; set; } = string.Empty;

    public int? IndustryTypeId { get; set; }

    public string LegalNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string ConfirmPassword { get; set; } = string.Empty;
}

public sealed class ContactClientRegistrationCommand
{
    public string Name { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string JobTitle { get; set; } = string.Empty;
}

public sealed class CompanyLocationClientRegistrationCommand
{
    public string MailingAddress { get; set; } = string.Empty;

    public string MailingApartment { get; set; } = string.Empty;

    public string MailingPostalCode { get; set; } = string.Empty;

    public string InLandAddress { get; set; } = string.Empty;

    public string InLandApartment { get; set; } = string.Empty;

    public string InLandPostalCode { get; set; } = string.Empty;

    public bool InLandByAutoLog { get; set; }

    public bool Insurance { get; set; }

    public string WhoIsInChargeOfInLand { get; set; } = string.Empty;

    public int? DestinationPortId { get; set; }

    public bool CustomClearenceByAutoLog { get; set; }

    public string Comments { get; set; } = string.Empty;
}
#endregion

public class ClientRegistrationCommandHandler : IRequestHandler<ClientRegistrationCommand, ClientRegistrationResponseDto>
{
    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IEmailService _emailService;
    private readonly IUserIdTokenProvider _userIdTokenProvider;

    public ClientRegistrationCommandHandler(IIdentityService identityService,
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
        IEmailService emailService,
        IUserIdTokenProvider userIdTokenProvider)
    {
        _identityService = identityService;
        _mapper = mapper;
        _userManager = userManager;
        _emailService = emailService;
        _userIdTokenProvider = userIdTokenProvider;
    }

    public async Task<ClientRegistrationResponseDto> Handle(ClientRegistrationCommand request, CancellationToken cancellationToken)
    {
        var userDto = _mapper.Map<UserRegistrationDto>(request.Company);

        var newUser = await CreateUserAsync(request, userDto);

        var verificationToken = _userIdTokenProvider.Generate(TokenPurposes.VERIFICATION_STATUS, newUser.Id);
        SendVerificationInformationNotificationAsync(newUser.Email!, request.Contact.Name, request.Company.NameEn, verificationToken).Forget();

        return new ClientRegistrationResponseDto
        {
            VerificationToken = verificationToken,
        };
    }

    private async Task<ApplicationUser> CreateUserAsync(ClientRegistrationCommand request, UserRegistrationDto userDto)
    {
        var newUser = _mapper.Map<ApplicationUser>(userDto);
        newUser.PasswordHash = _userManager.PasswordHasher.HashPassword(newUser, userDto.Password);
        newUser.Locale = CultureInfo.CurrentUICulture.Name;
        newUser.Company = _mapper.Map<Company>(request.Company);
        newUser.Company.Contacts = new List<CompanyContact>
        {
            _mapper.Map<CompanyContact>(request.Contact)
        };
        newUser.Company.Location = _mapper.Map<CompanyLocation>(request.CompanyLocation);

        var result = await _identityService.CreateUserAsync(newUser);
        if (!result.Succeeded)
        {
            throw new ValidationException(_mapper.Map<List<ValidationFailure>>(result.Errors));
        }

        var roleResult = await _identityService.AddRoleAsync(newUser, Roles.Client);
        if (!roleResult.Succeeded)
        {
            throw new ValidationException(_mapper.Map<List<ValidationFailure>>(roleResult.Errors));
        }

        return newUser;
    }

    private async Task SendVerificationInformationNotificationAsync(string email, string name, string companyName, string token)
    {
        await _emailService.SendVerificationInformationAsync(new VerificationInformationEmailDto
        {
            Email = email,
            Token = token,
            CompanyName = companyName,
            FirstName = name,
        });
    }
}