using AutoLog.Application.Common.Constants;
using AutoLog.Application.Geo.Queries.GetConatinerFullInfo;
using FluentValidation;

namespace AutoLog.Application.Geo.Queries.GetContainerShortInfo;

public sealed class GetContainerFullInfoQueryValidator : AbstractValidator<GetContainerFullInfoQuery>
{
    public GetContainerFullInfoQueryValidator()
    {
        RuleFor(x => x.ContainerNumber).NotEmpty().WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}

