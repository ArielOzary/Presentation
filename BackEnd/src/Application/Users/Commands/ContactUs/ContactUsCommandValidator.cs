using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Users.Commands.ContactUs;

public sealed class ContactUsCommandValidator : AbstractValidator<ContactUsCommand>
{
    public ContactUsCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.CompanyName).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Email).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Phone).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.Message).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED)
            .MaximumLength(100).WithErrorCode(ErrorCodes.COMMENTS_LENGTH_EXCEEDED_100);
    }
}
