using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Geo.Queries.GetConatinerFullInfo;

public sealed class GetContainerFullInfoQueryValidator : AbstractValidator<GetContainerFullInfoQuery>
{
    public GetContainerFullInfoQueryValidator()
    {
        RuleFor(x => x.ContainerNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
