using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Validators;
using FluentValidation;

namespace AutoLog.Application.Quotes.Commands.RequestCustomQuoteCommand;

public sealed class RequestCustomQuoteCommandValidator : AbstractValidator<RequestCustomQuoteCommand>
{
    public RequestCustomQuoteCommandValidator()
    {
        RuleFor(x => x.CompanyIds).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.QuoteLoads).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.QuoteGood).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);

        RuleFor(x => x.ShippingType).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.ShippingType).SetValidator(new ShippingTypeCreateDtoValidator());

        RuleFor(x => x.Destination).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Destination).SetValidator(new ShippingLocationCreateDtoValidator());

        RuleFor(x => x.Origin).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Origin).SetValidator(new ShippingLocationCreateDtoValidator());
    }
}
