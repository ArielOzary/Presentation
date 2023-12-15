using FluentValidation;

namespace AutoLog.Application.ShipmentStatuses.Commands.UpdateShipmentStatus;

public sealed class UpdateShipmentStatusCommandValidator : AbstractValidator<UpdateShipmentStatusCommand>
{
    public UpdateShipmentStatusCommandValidator()
    {
    }
}
