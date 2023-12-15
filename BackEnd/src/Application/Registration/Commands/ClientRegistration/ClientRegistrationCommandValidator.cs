using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Registration.Commands.ClientRegistration;

public class ClientRegistrationCommandValidator : AbstractValidator<ClientRegistrationCommand>
{
    public ClientRegistrationCommandValidator()
    {
        RuleFor(x => x.Company.NameEn).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Company.NameHe).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Company.LegalNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Company.IndustryTypeId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.Company.Email).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Company.Password).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED).Equal(x => x.Company.ConfirmPassword).WithErrorCode(ErrorCodes.PASSWORDS_NOT_MATCH);
        RuleFor(x => x.Company.ConfirmPassword).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED).Equal(x => x.Company.Password).WithErrorCode(ErrorCodes.PASSWORDS_NOT_MATCH);

        RuleFor(x => x.Contact.Name).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Contact.PhoneNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Contact.Email).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Contact.JobTitle).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.CompanyLocation.Comments).MaximumLength(100).WithErrorCode(ErrorCodes.COMMENTS_LENGTH_EXCEEDED_100);
        RuleFor(x => x.CompanyLocation.Insurance).NotNull().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.WhoIsInChargeOfInLand).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.CustomClearenceByAutoLog).NotNull().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.InLandByAutoLog).NotNull().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.CompanyLocation.InLandAddress).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.InLandApartment).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.InLandPostalCode).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.CompanyLocation.MailingAddress).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.MailingApartment).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.MailingPostalCode).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
