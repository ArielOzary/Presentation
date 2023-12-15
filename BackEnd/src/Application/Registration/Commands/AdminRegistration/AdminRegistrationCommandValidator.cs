using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Registration.Commands.AdminRegistration;

public class AdminRegistrationCommandValidator : AbstractValidator<AdminRegistrationCommand>
{
    public AdminRegistrationCommandValidator()
    {
        this.RuleFor(x => x.PhoneNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        this.RuleFor(x => x.CompanyName).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        this.RuleFor(x => x.LegalNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        this.RuleFor(x => x.Fax).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        this.RuleFor(x => x.JobTitle).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
