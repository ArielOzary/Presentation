using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.ShippingType;
using FluentValidation;

namespace AutoLog.Application.Common.Validators;

public class ShippingTypeUpdateDtoValidator : AbstractValidator<ShippingTypeUpdateDto>
{
    public ShippingTypeUpdateDtoValidator()
    {
        RuleFor(x => x.ShipmentType).IsInEnum().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.ShipmentIncoterms).IsInEnum().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.ShipmentOption).IsInEnum().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
