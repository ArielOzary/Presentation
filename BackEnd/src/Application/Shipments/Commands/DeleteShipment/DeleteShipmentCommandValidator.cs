using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Shipments.Commands.DeleteShipment;

public sealed class DeleteShipmentCommandValidator : AbstractValidator<DeleteShipmentCommand>
{
    public DeleteShipmentCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Reason).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
