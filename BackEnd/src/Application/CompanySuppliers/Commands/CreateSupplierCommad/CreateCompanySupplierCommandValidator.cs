using AutoLog.Application.Common.Constants;
using AutoLog.Application.CompanySuppliers.Commands.CreateSupplier;
using FluentValidation;

namespace AutoLog.Application.CompanySuppliers.Commands.CreateSupplierCommad;

public sealed class CreateCompanySupplierCommandValidator : AbstractValidator<CreateCompanySupplierCommand>
{
    public CreateCompanySupplierCommandValidator()
    {
        RuleFor(x => x.ContactName).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Email).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.PhoneNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyName).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyAddress).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyApartment).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyPostalCode).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyPhoneNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
