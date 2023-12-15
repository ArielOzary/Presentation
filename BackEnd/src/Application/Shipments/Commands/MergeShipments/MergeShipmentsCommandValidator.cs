using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Shipments.Commands.MergeShipments;

public sealed class MergeShipmentsCommandValidator : AbstractValidator<MergeShipmentsCommand>
{
    public MergeShipmentsCommandValidator()
    {
        RuleFor(x => x.OldShipmentId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.NewShipmentId).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}

