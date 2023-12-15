using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Shipments.Commands.AddContainerNumberOrVesselName;

public sealed class AddContainerNumberOrVesselNameCommandValidator : AbstractValidator<AddContainerNumberOrVesselNameCommand>
{
    public AddContainerNumberOrVesselNameCommandValidator()
    {
        RuleFor(x => x.ContainerNumberOrVesselName).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
