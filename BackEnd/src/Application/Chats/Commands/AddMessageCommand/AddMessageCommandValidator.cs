using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Chats.Commands.AddMessageCommand;

public sealed class AddMessageCommandValidator : AbstractValidator<AddMessageCommand>
{
    public AddMessageCommandValidator()
    {
        RuleFor(x => x.Message).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}