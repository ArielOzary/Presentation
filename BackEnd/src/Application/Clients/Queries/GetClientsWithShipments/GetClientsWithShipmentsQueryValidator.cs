using AutoLog.Application.Common.Constants;
using FluentValidation;

namespace AutoLog.Application.Clients.Queries.GetClientsWithShipments;

public sealed class GetClientsWithShipmentsQueryValidator : AbstractValidator<GetClientsWithShipmentsQuery>
{
    public GetClientsWithShipmentsQueryValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0).WithErrorCode(ErrorCodes.FIELD_REQUIRED);
        RuleFor(x => x.PageSize).GreaterThan(0).WithErrorCode(ErrorCodes.FIELD_REQUIRED);
    }
}
