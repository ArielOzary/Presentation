using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Emails.Shipments;
using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Shipments.Commands.CreateShipment;

public sealed class CreateShipmentCommand : IRequest<string>
{
    public int CompanyId { get; set; }

    public int SupplierId { get; set; }

    public int RateId { get; set; }

    public ShippingTypeCreateDto ShippingType { get; set; } = null!;

    public ShippingLocationCreateDto Destination { get; set; } = null!;

    public ShippingLocationCreateDto Origin { get; set; } = null!;

    public QuoteGoodCreateDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadCreateDto> QuoteLoads { get; set; } = null!;

    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;
}

public sealed class CreateShipmentCommandHandler : IRequestHandler<CreateShipmentCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;

    public CreateShipmentCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IMapper mapper,
        IEmailService emailService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _mapper = mapper;
        _emailService = emailService;
    }

    public async Task<string> Handle(CreateShipmentCommand request, CancellationToken cancellationToken)
    {
        var rate = await _context.Rates
            .Include(x => x.Company)
            .FirstOrDefaultAsync(rate => rate.Id == request.RateId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.RATE_NOT_FOUND);

        request.UserId = _currentUserService.UserId!;

        double shipmentTotalProfit = await GetShipmentClientTotalProfitAsync(request, cancellationToken);

        // Before creating shipment quote should be calculated in search of available quotes
        var newQuote = _mapper.Map<Quote>(request);
        newQuote.CompanyId = request.CompanyId;
        newQuote.HasShipment = true;

        var shipment = await CreateShipmentAsync(request, rate, newQuote, shipmentTotalProfit, cancellationToken);

        await _context.Shipments.AddAsync(shipment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        await SendEmailAsync(request, newQuote.Id, shipment, cancellationToken);

        return shipment.Id!;
    }

    private async Task<double> GetShipmentClientTotalProfitAsync(CreateShipmentCommand request, CancellationToken cancellationToken)
    {
        var clientProfit = await _context.ClientProfits.FirstOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken);
        var isRequiredCustomClearance = await _context.Companies.Include(x => x.Location)
            .Where(x => x.UserId == request.UserId)
            .Select(x => x.Location.CustomClearance).FirstOrDefaultAsync(cancellationToken);

        var shipmentTotalProfit = 0.0;
        var shipmentFreightProfit = 0.0;

        if (clientProfit != null)
        {
            shipmentFreightProfit = request.ShippingType.ShipmentOption switch
            {
                ShipmentOption.Air => shipmentFreightProfit += clientProfit.Air,
                ShipmentOption.Ocean => shipmentFreightProfit = request.ShippingType.ShipmentType switch
                {
                    ShipmentType.LCL => shipmentFreightProfit += clientProfit.LCL,
                    ShipmentType.FCL => shipmentFreightProfit += clientProfit.FCL,
                    _ => throw new NotImplementedException(),
                },
                _ => throw new NotImplementedException(),
            };
        }

        shipmentTotalProfit = request.ShippingType.ShipmentIncoterms switch
        {
            ShipmentIncoterms.EXW => clientProfit.OriginCharges + clientProfit.DestinationCharges + shipmentFreightProfit,
            ShipmentIncoterms.FOB => clientProfit.DestinationCharges + shipmentFreightProfit,
            ShipmentIncoterms.CIF => clientProfit.DestinationCharges,
            ShipmentIncoterms.DDP => clientProfit.OriginCharges + clientProfit.DestinationCharges + shipmentFreightProfit,
            _ => throw new NotImplementedException(),
        };

        if (isRequiredCustomClearance)
        {
            shipmentTotalProfit += clientProfit.CustomClearance;
        }

        return shipmentTotalProfit;
    }

    private async Task<Shipment> CreateShipmentAsync(CreateShipmentCommand request, Rate rate, Quote newQuote, double shipmentTotalProfit, CancellationToken cancellationToken)
    {
        var currentUser = await _context.Users
            .FirstOrDefaultAsync(user => user.Id == _currentUserService.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND, ErrorCodes.USER_NOT_FOUND);

        return new Shipment
        {
            Quote = newQuote,
            Rate = rate,
            CompanyId = newQuote.CompanyId,
            ShippingType = newQuote.ShippingType,
            UserId = request.UserId,
            ShipmentTotalProfit = shipmentTotalProfit,
            //OpenStatusStage = OpenStatusStage.ContactSupplierStatus,
            ShipmentStatuses = new List<ShipmentStatus>
            {
                new ShipmentStatus {
                    Stage = ShipmentStatusStage.Open,
                    StageString = ShipmentStatusStage.Open.ToString(),
                }
            },
            Conversation = new Conversation
            {
                Users = new List<ApplicationUser> { currentUser },
            }
        };
    }

    private async Task SendEmailAsync(CreateShipmentCommand request, int newQuoteId, Shipment shipment, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company.Contacts)
            .FirstAsync(x => x.Id == _currentUserService.UserId, cancellationToken);

        var freightCompany = await _context.Companies
            .Include(x => x.User)
            .Include(x => x.Contacts)
            .FirstOrDefaultAsync(x => x.Id == request.CompanyId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.COMPANY_NOT_FOUND);

        var supplier = await _context.CompanySuppliers
            .FirstOrDefaultAsync(x => x.Id == request.SupplierId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SUPPLIER_NOT_FOUND);

        var quote = await _context.Quotes
            .Include(x => x.Origin!.Port)
            .Include(x => x.Destination!.Port)
            .FirstOrDefaultAsync(x => x.Id == newQuoteId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.QUOTE_NOT_FOUND);

        await _emailService.SendCreateShipmentAsync(new CreateShipmentEmailDto
        {
            Email = freightCompany?.User.Email!,
            ShipmentName = $"FREIGHT-{shipment.Id![..13]}",
            CompanyName = freightCompany?.NameEn!,
            UserName = user.Company.Contacts!
                .First(x => x.CompanyId == user!.Company.Id && x.ContactType == CompanyContactType.Basic).Name,
            QuoteId = quote.Id,
            RateId = request.RateId,
            SupplierName = supplier.ContactName,
            SupplierContactEmail = supplier.Email,
            SupplierContactPhone = supplier.PhoneNumber,
            SupplierAddress = supplier.CompanyAddress,
            SupplierApartment = supplier.CompanyApartment,
            SupplierPostalCode = supplier.CompanyPostalCode,
            Origin = quote!.Origin?.Country!,
            Destination = quote!.Destination?.Country!,
            FirstName = freightCompany?.Contacts?
                .First(x => x.CompanyId == freightCompany.Id && x.ContactType != CompanyContactType.Basic).Name!,
            Locale = freightCompany?.User.Locale!
        });
    }
}
