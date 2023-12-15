using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Extensions;

public static class ShipmentFiltersExtension
{
    public static IQueryable<Shipment> ApplyFilters(
        this IQueryable<Shipment> queryable,
        ShipmentFilterDto request,
        ICurrentUserService userService)
    {
        return queryable
            .ApplyRoleFilters(userService)
            .ApplySearchFilters(request)
            .ApplyShipmentClientCompanyFilters(request)
            .ApplyShipmentTOSFilters(request)
            .ApplySortOption(request, userService);
    }

    private static IQueryable<Shipment> ApplySortOption(
        this IQueryable<Shipment> queryable,
        ShipmentFilterDto request,
        ICurrentUserService userService)
    {
        var delayedStageSort = queryable
            .OrderByDescending(x => x.ShipmentStatuses.Any(x => x.Stage == ShipmentStatusStage.Delayed))
            .ThenByDescending(x => x.IsError)
            .ThenByDescending(x => x.ReminderStatus == (userService.Roles!.Contains(Roles.FreightForwarder) ? ReminderStatus.FFReminder : ReminderStatus.ClientReminder))
            .ThenBy(x => x.ReminderStatus);

        queryable = request.SortOption switch
        {
            ShipmentSortOption.LastAdded => delayedStageSort.ThenByDescending(x => x.Created),
            ShipmentSortOption.CreationDate => delayedStageSort.ThenBy(x => x.Created),
            ShipmentSortOption.Name => delayedStageSort.ThenBy(x => x.Id),
            ShipmentSortOption.Status => delayedStageSort.ThenBy(x => x.ShipmentStatuses.OrderBy(x => x.Id).Last()!.Stage),
            null => delayedStageSort.ThenBy(x => x.Created),
            _ => throw new NotImplementedException(),
        };

        return queryable;
    }

    private static IQueryable<Shipment> ApplySearchFilters(
        this IQueryable<Shipment> queryable,
        ShipmentFilterDto request)
    {
        if (request.SearchFilter is not null)
        {
            var filter = request.SearchFilter;

            queryable = queryable
                .WhereIf(!string.IsNullOrEmpty(filter.ContainerNumberOrVesselName),
                x => !string.IsNullOrEmpty(x.ContainerNumberOrVesselName) && x.ContainerNumberOrVesselName.Equals(filter.ContainerNumberOrVesselName))
                .WhereIf(!string.IsNullOrEmpty(filter.Search),
                x =>
                    x.Id!.Substring(0, 13).Contains(filter.Search!) ||
                    x.Company != null && x.Company.NameEn.Contains(filter.Search!) ||
                    x.User != null && x.User.Company.Contacts!.First(y => y.CompanyId == x.User.Company.Id && y.ContactType == CompanyContactType.Basic).Name.Contains(filter.Search!) ||
                    x.Quote != null && x.Quote.Origin!.Country.Contains(filter.Search!) ||
                    x.Quote != null && x.Quote.Destination!.Country.Contains(filter.Search!));
        }

        return queryable;
    }

    private static IQueryable<Shipment> ApplyShipmentClientCompanyFilters(
        this IQueryable<Shipment> queryable,
        ShipmentFilterDto request)
    {
        if (request.ClientCompanyFilter is not null)
        {
            var filter = request.ClientCompanyFilter;

            queryable = queryable
                .WhereIf(filter.ClientIds is not null, x => !string.IsNullOrEmpty(x.UserId) && filter.ClientIds!.Contains(x.UserId))
                .WhereIf(filter.CompanyIds is not null, x => x.Company != null && filter.CompanyIds!.Contains(x.Company.Id));
        }

        return queryable;
    }

    private static IQueryable<Shipment> ApplyShipmentTOSFilters(
        this IQueryable<Shipment> queryable,
        ShipmentFilterDto request)
    {
        if (request.TOSFilter is not null)
        {
            var filter = request.TOSFilter;

            queryable = queryable
                .WhereIf(filter.ShipmentTypes is not null, x => x.ShippingType!.ShipmentType.HasValue && filter.ShipmentTypes!.Contains(x.ShippingType!.ShipmentType.Value))
                .WhereIf(filter.ShipmentOptions is not null, x => x.ShippingType!.ShipmentOption.HasValue && filter.ShipmentOptions!.Contains(x.ShippingType!.ShipmentOption.Value));

            if (filter.ShipmentStatuses is not null && filter.ShipmentStatuses.Count() != 9)
                queryable = queryable
                    .Where(x => filter.ShipmentStatuses!.Contains(x.ShipmentStatuses.OrderBy(x => x.Id).Last().Stage)
                    || (filter.ShipmentStatuses.Contains(ShipmentStatusStage.Delayed) && x.ShipmentStatuses.Any(f => f.Stage == ShipmentStatusStage.Delayed)));
            //.WhereIf(filter.ShipmentStatuses is not null && !filter.ShipmentStatuses.Contains(ShipmentStatusStage.Delayed),
            //    x => filter.ShipmentStatuses!.Contains(x.ShipmentStatuses.OrderBy(x => x.Id).Last(x => x.Stage != ShipmentStatusStage.Delayed).Stage));

            //Remove from active tab Delivared shipments
            if (filter.ShipmentStatuses is not null && !filter.ShipmentStatuses.Contains(ShipmentStatusStage.Delivered) || filter.ShipmentStatuses is null)
            {
                queryable = queryable.Where(x => !x.ShipmentStatuses.Any(f => f.Stage == ShipmentStatusStage.Delivered));
            }
        }
        else
        {
            queryable = queryable.Where(x => x.ShipmentStatuses.OrderBy(x => x.Id).Last()!.Stage != ShipmentStatusStage.Delivered);
        }

        return queryable;
    }

    private static IQueryable<Shipment> ApplyRoleFilters(
        this IQueryable<Shipment> queryable,
        ICurrentUserService userService)
    {
        return queryable
            .WhereIf(userService.Roles!.Contains(Roles.Client), x => x.UserId == userService.UserId)
            .WhereIf(userService.Roles!.Contains(Roles.FreightForwarder), x => x.CompanyId == userService.CompanyId);
    }
}
