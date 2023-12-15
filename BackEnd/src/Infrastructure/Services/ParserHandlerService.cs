using System.Globalization;
using System.Text.RegularExpressions;
using AutoLog.Application.Common.Dtos.EmailParserDtos;
using AutoLog.Application.Common.Dtos.Emails.NoticeOfArrival;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.MassTransit.Requests;
using AutoLog.Application.Common.MassTransit.Utils;
using AutoLog.Application.Common.Utils;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AutoLog.Infrastructure.Services;

public partial class ParserHandlerService : IParserHandlerService
{
    [GeneratedRegex("(ETA)\\s+[A-Za-z]+\\s+([A-Za-z]+,\\d+)")]
    private static partial Regex ETARegex();

    [GeneratedRegex("(ETD)\\s+[A-Za-z]+\\s+([A-Za-z]+,\\d+)")]
    private static partial Regex ETDRegex();

    [GeneratedRegex("CN/SN:\\s*(\\S+)")]
    private static partial Regex ContainerNumberRegex();

    private readonly IApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<ParserHandlerService> _logger;

    public ParserHandlerService(IApplicationDbContext context, IEmailService emailService, ILogger<ParserHandlerService> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task HandleAsync(ShipmentDataRequest shipmentDataRequest)
    {
        if (shipmentDataRequest is not null)
        {
            await HandleEmailDataAsync(shipmentDataRequest);
            await HandleAttachmentsDataAsync(shipmentDataRequest);
        }
    }

    public async Task HandleStatusesAsync(CancellationToken cancellationToken)
    {
        var bookedShipments = await _context.Shipments
            .Include(x => x.ShipmentStatuses)
            .Where(x => x.ShipmentStatuses.OrderBy(x => x.Id).Last().Stage == ShipmentStatusStage.Booking)
            .Where(x => x.ETD <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        var onBoarderShipments = await _context.Shipments
            .Include(x => x.ShipmentStatuses)
            .Where(x => x.ShipmentStatuses.OrderBy(x => x.Id).Last().Stage == ShipmentStatusStage.GoodsAreOnBoardOrActualDeparture)
            .Where(x => x.ETA <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var shipment in bookedShipments)
        {
            AddShipmentStatus(shipment, ShipmentStatusStage.EstimatedTimeOfDeparture);
        }

        foreach (var shipment in onBoarderShipments)
        {
            AddShipmentStatus(shipment, ShipmentStatusStage.EstimatedTimeOfArrival);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task HandleAttachmentsDataAsync(ShipmentDataRequest request)
    {
        if (request.AttachmentsData is null)
            return;
    }

    private async Task HandleEmailDataAsync(ShipmentDataRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.EmailData is null)
            return;

        var shipmentData = request.EmailData.ShipmentData!;
        var goodsData = request.EmailData.GoodsData!;
        var email = request.EmailData.ContactsData!.StatusUpdateSender!.Email;
        var status = shipmentData.Status;
        

        var shipmentNumber = shipmentData.ShipmentNumber;
        if (!string.IsNullOrEmpty(shipmentNumber))
        {
            var splittedShipmentNumber = shipmentData.ShipmentNumber.Split('-');
            if (splittedShipmentNumber?.Length > 0)
            {
                shipmentNumber = splittedShipmentNumber[1];
            }
        }

        Shipment? shipment = null;
        if (!string.IsNullOrEmpty(shipmentNumber))
        {
            shipment = await _context.Shipments
               .Include(x => x.ShipmentStatuses)
               .Include(x => x.User!.Company.Contacts)
               .FirstOrDefaultAsync(x => x.Id.StartsWith(shipmentNumber), cancellationToken);
        }
        

        if (shipment is null)
        {
            await CreateShipmentInCaseOfAbsenceAsync(shipmentData, goodsData, email, cancellationToken);
        }
        else
            switch (status)
            {
                case ParserStatuses.Open:
                    await HandleStatusAsync(shipment, shipmentData, cancellationToken: cancellationToken);
                    break;
                case ParserStatuses.Booking:
                    await HandleStatusAsync(shipment, shipmentData, cancellationToken, ShipmentStatusStage.Booking);
                    break;
                case ParserStatuses.OnBoard:
                    await HandleStatusAsync(shipment, shipmentData, cancellationToken, ShipmentStatusStage.GoodsAreOnBoardOrActualDeparture);
                    break;
                case ParserStatuses.Delay:
                    await HandleStatusAsync(shipment, shipmentData, cancellationToken, ShipmentStatusStage.Delayed);
                    break;
                case "":
                    await HandleStatusAsync(shipment, shipmentData, cancellationToken, ShipmentStatusStage.NoticeOfArrival);
                    break;
                default:
                    await HandleErrorMergeAsync(shipment, true, cancellationToken);
                    break;
            };
    }

    private async Task HandleStatusAsync(
        Shipment shipment,
        EmailParserShipmentDataDto dto,
        CancellationToken cancellationToken,
        ShipmentStatusStage status = ShipmentStatusStage.Open)
    {
        var remarks = ParseDetails(dto.BookingDetails);
        var etdCheck = false;
        var etaCheck = false;

        if (remarks != null)
        {
            if (remarks.ETA is not null)
            {
                shipment.ETA = remarks.ETA.Value;
                if (status == ShipmentStatusStage.Booking)
                    etaCheck = true;
            }
            if (remarks.ETD is not null)
            {
                shipment.ETD = remarks.ETD.Value;
                if (status == ShipmentStatusStage.Booking)
                    etdCheck = true;
            }
            if (!string.IsNullOrEmpty(remarks.ContainerNumber))
                shipment.ContainerNumberOrVesselName = remarks.ContainerNumber;

            await HandleErrorMergeAsync(shipment, etaCheck && etdCheck, cancellationToken);
        }

        await RemoveRemindersAsync(shipment, status, cancellationToken);

        await NotifyShipmentStatusAsync(status, shipment);
    }

    private async Task RemoveRemindersAsync(Shipment shipment, ShipmentStatusStage status, CancellationToken cancellationToken)
    {
        if (status != ShipmentStatusStage.Open)
        {
            var freightForwarders = await _context.Users
                .Include(x => x.ReminderEmail)
                .Where(x => x.ReminderEmail != null)
                .ToListAsync(cancellationToken);

            foreach (var freightForwarder in freightForwarders)
            {
                if (shipment.Id == freightForwarder.ReminderEmail!.ShipmentId)
                    freightForwarder.ReminderEmail = null;

                shipment.ReminderStatus = ReminderStatus.FFReminder;
                freightForwarder.ReminderEmail = null;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task HandleErrorMergeAsync(Shipment shipment, bool isError, CancellationToken cancellationToken)
    {
        shipment.IsError = isError;

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task NotifyShipmentStatusAsync(ShipmentStatusStage status, Shipment shipment)
    {
        if (status != ShipmentStatusStage.Open)
            AddShipmentStatus(shipment, status);
        if (status == ShipmentStatusStage.NoticeOfArrival)
        {
            var date = DateTime.UtcNow;
            shipment.ETA = date;
            var user = shipment.User;

            if (user is null)
            {
                return;
            }

            await _emailService.SendNoticeOfArrivalAsync(new NoticeOfArrivalEmailDto
            {
                ShipmentName = $"FREIGHT-{shipment.Id![..13]}",
                ClientsName = user!.Company.Contacts!
                    .First(x => x.CompanyId == user.Company.Id && x.ContactType == CompanyContactType.Basic).Name,
                ArrivalDate = date.ToString("dddd, dd MMMM yyyy h:mm tt"),
                Email = user.Email!,
                Locale = user.Locale,
            });
        }
    }

    private static void AddShipmentStatus(Shipment shipment, ShipmentStatusStage status)
    {
        var parentStatus = shipment.ShipmentStatuses.First();
        parentStatus.ChildrenShipmentStatuses.Add(new ShipmentStatus
        {
            Stage = status,
            StageString = status.ToString(),
            ShipmentId = shipment.Id,
            ParentShipmentStatusId = parentStatus.Id,
            ParentShipmentStatus = parentStatus
        });
    }

    private static ParseRemarks? ParseDetails(string bookingDetails)
    {
        var matchETA = ETARegex().Match(bookingDetails);
        var matchETD = ETDRegex().Match(bookingDetails);
        var matchContainer = ContainerNumberRegex().Match(bookingDetails);

        if (!matchETA.Success && !matchETD.Success && !matchContainer.Success)
            return null;

        return new ParseRemarks
        {
            ETA = ConvertToDateTime(matchETA!),
            ETD = ConvertToDateTime(matchETD!),
            ContainerNumber = matchContainer.Groups[1].Value
        };

        static DateTime? ConvertToDateTime(Match match)
        {
            if (!match.Success)
                return null;

            var dateString = match.Groups[2].Value;
            return DateTime.ParseExact(dateString, "MMM,dd", CultureInfo.InvariantCulture);
        }
    }

    private async Task CreateShipmentInCaseOfAbsenceAsync(EmailParserShipmentDataDto shipmentData, List<EmailParserGoodsDataDto> goodsData, string email, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

        var quoteLoads = new List<QuoteLoad>();
        var shippingType = new ShippingType(shipmentData.Incoterms, shipmentData.ShipmentOption, shipmentData.ShipmentType);

        foreach (var good in goodsData)
        {
            quoteLoads.Add(new QuoteLoad(
                good.ContainerType,
                good.WeightFormat,
                good.VolumeFormat,
                good.TotalWeight.HasValue ? good.TotalWeight.Value : default,
                good.TotalVolume.HasValue ? good.TotalVolume.Value : default,
                good.NumberOfPackages.HasValue ? good.NumberOfPackages.Value : default
            ));
        }

        var quote = new Quote
        {
            QuoteLoads = quoteLoads,
            ShippingType = shippingType,
            Destination = await GetShipmentLocationAsync(shipmentData.DestinationPort, cancellationToken),
            Origin = await GetShipmentLocationAsync(shipmentData.OriginPort, cancellationToken),
            HasShipment = true,
            User = user,
            Company = user?.Company
        };

        var newShipment = new Shipment
        {
            Quote = quote,
            Rate = null,
            Company = user?.Company,
            User = user,
            ShippingType = quote.ShippingType,
            ShipmentStatuses = new List<ShipmentStatus>
                {
                    new ShipmentStatus {
                        Stage = ShipmentStatusStage.Open,
                        StageString = ShipmentStatusStage.Open.ToString(),
                    }
                },
            IsError = true
        };

        await _context.Shipments.AddAsync(newShipment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<ShippingLocation?> GetShipmentLocationAsync(string port, CancellationToken cancellationToken)
    {
        var portLowerVariant = port.ToLower();
        var selectedPort = await _context.Ports
            .FirstOrDefaultAsync(x => x.Name.ToLower().Equals(portLowerVariant), cancellationToken);

        return selectedPort is null ? null :
            new ShippingLocation
            {
                Country = selectedPort!.Country,
                PortId = selectedPort.Id,
                Port = selectedPort,
            };
    }
}
