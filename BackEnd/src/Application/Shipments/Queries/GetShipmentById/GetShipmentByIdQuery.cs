using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using AutoLog.Application.ShipmentStatuses.Queries.GetShipmentStatusById;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Shipments.Queries.GetShipmentById;

public sealed class GetShipmentByIdQuery : IRequest<ShipmentDetailDto?>
{
    public string Id { get; set; } = string.Empty;
}

public sealed class GetShipmentByIdQueryHandler : IRequestHandler<GetShipmentByIdQuery, ShipmentDetailDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly ISender _mediator;

    public GetShipmentByIdQueryHandler(
        IMapper mapper,
        IApplicationDbContext context,
        ISender mediator,
        ICurrentUserService currentUserService)
    {
        _mapper = mapper;
        _context = context;
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

    public async Task<ShipmentDetailDto?> Handle(GetShipmentByIdQuery request, CancellationToken cancellationToken)
    {
        var shipment = await _context.Shipments
            .AsNoTracking()
            .Include(x => x.Quote!.QuoteLoads)
            .Include(x => x.Quote!.Origin)
            .Include(x => x.Quote!.Destination)
            .Include(x => x.Quote!.ShippingType)
            .Include(x => x.User!.Company.Contacts)
            .Include(x => x.User!.ClientProfits)
            .Include(x => x.Company)
            .Include(x => x.ShipmentStatuses)
            .Include(x => x.ShipmentFiles)
            .Include(x => x.Conversation.Messages)
            .Where(shipment => shipment.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SHIPMENT_NOT_FOUND);

        var isAdmin = _currentUserService.Roles!.Contains(Roles.Admin);

        if (!isAdmin && shipment.UserId != _currentUserService.UserId && shipment.CompanyId != _currentUserService.CompanyId)
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        var shipmentDto = _mapper.Map<ShipmentDetailDto>(shipment);


        // Some properties have to be mapped manually
        await MapShipmentDtoAsync(shipment, shipmentDto, cancellationToken);

        return shipmentDto;
    }

    private async Task MapShipmentDtoAsync(Shipment shipment, ShipmentDetailDto shipmentDto, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        shipmentDto.MyFiles = _mapper.Map<List<ShipmentFileDto>>(shipment.ShipmentFiles.Where(x => x.CreatedBy == userId).ToList());
        shipmentDto.OtherFiles = _mapper.Map<List<ShipmentFileDto>>(shipment.ShipmentFiles.Where(x => x.CreatedBy != userId).ToList());

        shipmentDto.ShipmentStatus = await _mediator.Send(new GetShipmentStatusByIdQuery { ShipmentId = shipmentDto.Id }, cancellationToken);
        shipmentDto.TotalWeight = shipment.Quote is not null && shipment.Quote.QuoteLoads is not null
            ? shipment.Quote.QuoteLoads.Sum(x => x.CalculationOption == CalculationOption.TotalShipment ? MassConverter.ConvertToKG(x.WeightFormat, x.Weight)
                : x.UnitsQuantity * x.WeightPerUnit) : 0;

        if (shipment.Conversation is null || !shipment.Conversation.Messages.Any())
            return;

        shipmentDto.UnreadMessagesAmount = shipment.Conversation.Messages.Count(x => x.Unread && x.UserId != userId);
        shipmentDto.Unread = shipment.Conversation.Messages.Any(x => x.Unread && x.UserId != userId);
    }
}
