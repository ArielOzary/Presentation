using AutoLog.Application.Common.Dtos.ShippingLocation;
using FluentValidation;

namespace AutoLog.Application.Common.Validators;

public class ShippingLocationCreateDtoValidator : AbstractValidator<ShippingLocationCreateDto>
{
    public ShippingLocationCreateDtoValidator()
    {
    }
}
