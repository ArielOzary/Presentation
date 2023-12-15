using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.RateCharges;
using FluentValidation;

namespace AutoLog.Application.Common.Validators;

public class RateChargesUpdateDtoValidator : AbstractValidator<RateChargesUpdateDto?>
{
    public RateChargesUpdateDtoValidator()
    {
        RuleFor(x => x!.FixedPriced).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x!.PerWeight).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x!.PerType).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
