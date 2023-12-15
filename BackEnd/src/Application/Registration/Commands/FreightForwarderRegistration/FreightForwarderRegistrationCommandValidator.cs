using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Registration.Commands.FreightForwarderRegistration;

public sealed class FreightForwarderRegistrationCommandValidator : AbstractValidator<FreightForwarderRegistrationCommand>
{
    public FreightForwarderRegistrationCommandValidator()
    {
        RuleFor(x => x.Company.NameEn).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Company.LegalNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Company.Email).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleForEach(x => x.Contacts).SetValidator(new ContactFreightForwarderRegistrationCommandValidator());

        RuleFor(x => x.CompanyLocation.Comments).MaximumLength(100).WithErrorCode(ErrorCodes.COMMENTS_LENGTH_EXCEEDED_100);

        RuleFor(x => x.CompanyLocation.InLandAddress).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.InLandApartment).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.InLandPostalCode).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.CompanyLocation.MailingAddress).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.MailingApartment).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyLocation.MailingPostalCode).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
