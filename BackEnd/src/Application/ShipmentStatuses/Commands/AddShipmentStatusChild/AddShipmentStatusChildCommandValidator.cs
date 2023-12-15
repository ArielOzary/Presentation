using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.ShipmentStatuses.Commands.AddShipmentStatusChild;

public sealed class AddShipmentStatusChildCommandValidator : AbstractValidator<AddShipmentStatusChildCommand>
{
    public AddShipmentStatusChildCommandValidator()
    {
        RuleFor(x => x.ParentId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
