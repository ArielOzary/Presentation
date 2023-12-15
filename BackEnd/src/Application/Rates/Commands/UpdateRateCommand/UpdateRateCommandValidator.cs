using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Validators;
using FluentValidation;

namespace AutoLog.Application.Rates.Commands.UpdateRateCommand;

public sealed class UpdateRateCommandValidator : AbstractValidator<UpdateRateCommand>
{
    public UpdateRateCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.IsDraft).NotNull().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.StartDate).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.EndDate).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.ShippingType).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.ShippingType).SetValidator(new ShippingTypeUpdateDtoValidator());

        RuleFor(x => x.FreightCharges).SetValidator(new RateChargesUpdateDtoValidator());
        RuleFor(x => x.DestinationCharges).SetValidator(new RateChargesUpdateDtoValidator());
        RuleFor(x => x.OriginCharges).SetValidator(new RateChargesUpdateDtoValidator());
    }
}
