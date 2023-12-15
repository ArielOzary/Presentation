using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Validators;
using FluentValidation;

namespace AutoLog.Application.Rates.Commands.CreateRateCommand;

public sealed class CreateRateCommandValidator : AbstractValidator<CreateRateCommand>
{
    public CreateRateCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.IsDraft).NotNull().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.StartDate).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.EndDate).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.ShippingType).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.ShippingType).SetValidator(new ShippingTypeCreateDtoValidator());

        RuleFor(x => x.FreightCharges).SetValidator(new RateChargesCreateDtoValidator());
        RuleFor(x => x.DestinationCharges).SetValidator(new RateChargesCreateDtoValidator());
        RuleFor(x => x.OriginCharges).SetValidator(new RateChargesCreateDtoValidator());
    }
}
