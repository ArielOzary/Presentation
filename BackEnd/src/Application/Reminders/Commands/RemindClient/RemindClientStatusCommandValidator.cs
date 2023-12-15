using FluentValidation;

namespace AutoLog.Application.Reminders.Commands.RemindClient;

public sealed class RemindClientStatusCommandValidator : AbstractValidator<RemindClientStatusCommand>
{
    public RemindClientStatusCommandValidator()
    {
    }
}
