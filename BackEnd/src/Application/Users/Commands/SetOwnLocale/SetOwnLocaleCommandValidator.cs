using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Users.Commands.SetOwnLocale;

public sealed class SetOwnLocaleCommandValidator : AbstractValidator<SetOwnLocaleCommand>
{
    public SetOwnLocaleCommandValidator()
    {
        RuleFor(x => x.Locale).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
