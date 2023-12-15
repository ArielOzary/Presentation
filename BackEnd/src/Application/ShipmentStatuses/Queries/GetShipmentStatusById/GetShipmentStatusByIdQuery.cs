using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MassTransit.Internals;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.ShipmentStatuses.Queries.GetShipmentStatusById;

public sealed class GetShipmentStatusByIdQuery : IRequest<ShipmentStatusDto?>
{
    public string ShipmentId { get; set; } = string.Empty;
}

public sealed class GetShipmentStatusByIdQueryHandler : IRequestHandler<GetShipmentStatusByIdQuery, ShipmentStatusDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetShipmentStatusByIdQueryHandler(IMapper mapper, IApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<ShipmentStatusDto?> Handle(GetShipmentStatusByIdQuery request, CancellationToken cancellationToken)
    {
        var shipmentStatusId = await _context.Shipments
            .AsNoTracking()
            .Where(s => s.Id == request.ShipmentId)
            .Include(s => s.ShipmentStatuses)
            .Select(shipment => shipment.ShipmentStatuses.First().Id)
            .FirstAsync(cancellationToken);

        // Because of selfrefrencing table we have to get all tree of statuses before maping
        var shipmentStatus = await GetShipmentStatusAsync(shipmentStatusId);

        //var query = @"
        //    WITH RecursiveCTE AS (
        //        SELECT *
        //        FROM ShipmentStatuses
        //        WHERE Id = {0}

        //        UNION ALL

        //        SELECT e.*
        //        FROM ShipmentStatuses e
        //        INNER JOIN RecursiveCTE r ON e.ParentShipmentStatusId = r.Id
        //    )
        //    SELECT *
        //    FROM RecursiveCTE rs";

        //var shipmentStatus = (await _context.ShipmentStatuses.FromSqlRaw(query, request.Id)
        //    .AsAsyncEnumerable().ToListAsync()).FirstOrDefault() 
        //    ?? throw new AutoLogException(ErrorCodes.SHIPMENT_STATUS_NOT_FOUND, ErrorCodes.SHIPMENT_STATUS_NOT_FOUND);

        var result = _mapper.Map<ShipmentStatusDto>(shipmentStatus);

        return result;
    }

    // TODO: Need optimize
    public async Task<ShipmentStatus> GetShipmentStatusAsync(int id)
    {
        var result = await _context.ShipmentStatuses
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_STATUS_NOT_FOUND);

        result.ChildrenShipmentStatuses = await GetChildrenAsync(id);

        return result;
    }

    public async Task<List<ShipmentStatus>> GetChildrenAsync(int id)
    {
        var result = _context.ShipmentStatuses
            .AsNoTracking()
            .Where(x => x.ParentShipmentStatusId == id);

        foreach (var item in result)
        {
            item.ChildrenShipmentStatuses = await GetChildrenAsync(item.Id);
        }

        return await result.ToListAsync();
    }
}
