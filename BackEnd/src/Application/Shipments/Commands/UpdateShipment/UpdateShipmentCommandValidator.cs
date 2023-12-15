using FluentValidation;

namespace AutoLog.Application.Shipments.Commands.UpdateShipment;

public sealed class UpdateShipmentCommandValidator : AbstractValidator<UpdateShipmentCommand>
{
    public UpdateShipmentCommandValidator()
    {
    }
}
