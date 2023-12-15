using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Registration.Commands.FreightForwarderRegistration;

public class ContactFreightForwarderRegistrationCommandValidator : AbstractValidator<ContactFreightForwarderRegistrationCommand>
{
    public ContactFreightForwarderRegistrationCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.PhoneNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Email).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.JobTitle).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
