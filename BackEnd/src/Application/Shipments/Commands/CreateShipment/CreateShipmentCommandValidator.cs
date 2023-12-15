using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Shipments.Commands.CreateShipment;

public sealed class CreateShipmentCommandValidator : AbstractValidator<CreateShipmentCommand>
{
    public CreateShipmentCommandValidator()
    {
        RuleFor(x => x.CompanyId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.RateId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.SupplierId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
