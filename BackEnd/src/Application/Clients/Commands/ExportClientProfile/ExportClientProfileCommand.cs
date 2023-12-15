using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Clients;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ClosedXML.Excel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Clients.Commands.ExportClientProfile;

public sealed class ExportClientProfileCommand : IRequest<ExportClientProfileCommandResult>
{
    public string UserId { get; set; } = string.Empty;
}

public sealed class ExportClientProfileCommandResult
{
    public MemoryStream Stream { get; set; } = null!;

    public string ContentType { get; } = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public string FileName { get; set; } = string.Empty;
}

public sealed class ExportClientProfileCommandHandler : IRequestHandler<ExportClientProfileCommand, ExportClientProfileCommandResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ExportClientProfileCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ExportClientProfileCommandResult> Handle(ExportClientProfileCommand request, CancellationToken cancellationToken)
    {
        var client = await _context.Users
            .AsNoTracking()
            .Include(x => x.Shipments)
            .Where(x => x.Id == request.UserId)
            .Where(x => x.UserRoles.Any(r => r.Role.Name == Roles.Client))
            .ProjectTo<ExportClientDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Client Data");
        FillWorksheet(client, worksheet);
        worksheet.Columns().AdjustToContents();
        
        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        return new ExportClientProfileCommandResult
        {
            Stream = stream,
            FileName = client.ContactName + ".xlsx"
        };
    }

    private static void FillWorksheet(ExportClientDto client, IXLWorksheet worksheet)
    {
        var clientHeaders = new List<string>
        {
            "Contact Name",
            "Company Name (EN)",
            "Contact Phone Number",
            "Contact Email",
            "Contact Job Title",
            "Total Profit",
        };

        var shipmentHeaders = new List<string>
        {
            "Name",
            "Company",
            "Container Number Or Vessel Name",
            "Arrival Date",
            "Destination Port",
            "Departure Date",
            "Origin Port",
            "Profits",
            "Status",
        };

        for (var col = 1; col <= clientHeaders.Count; col++)
        {
            worksheet.Cell(1, col).Value = clientHeaders[col - 1];
        }

        worksheet.Cell(2, 1).Value = client.ContactName;
        worksheet.Cell(2, 2).Value = client.CompanyNameEn;
        worksheet.Cell(2, 3).Value = client.ContactPhoneNumber;
        worksheet.Cell(2, 4).Value = client.ContactEmail;
        worksheet.Cell(2, 5).Value = client.ContactJobTitle;
        worksheet.Cell(2, 6).Value = client.TotalProfit;

        for (var col = 1; col <= shipmentHeaders.Count; col++)
        {
            worksheet.Cell(4, col).Value = shipmentHeaders[col - 1];
        }

        var i = 0;
        for (var row = 5; row <= client.Shipments.Count + 4; row++, i++)
        {
            worksheet.Cell(row, 1).Value = "FREIGHT-" + client.Shipments[i].Name;
            worksheet.Cell(row, 2).Value = client.Shipments[i].Company;
            worksheet.Cell(row, 3).Value = client.Shipments[i].ContainerNumberOrVesselName;
            worksheet.Cell(row, 4).Value = client.Shipments[i].ArrivalDate.ToString("dddd, dd MMMM yyyy");
            worksheet.Cell(row, 5).Value = client.Shipments[i].DestinationPort;
            worksheet.Cell(row, 6).Value = client.Shipments[i].DepartedDate.ToString("dddd, dd MMMM yyyy");
            worksheet.Cell(row, 7).Value = client.Shipments[i].OriginPort;
            worksheet.Cell(row, 8).Value = client.Shipments[i].Profits;
            worksheet.Cell(row, 9).Value = client.Shipments[i].ShipmentStatusStage.ToString() + (client.Shipments[i].IsDelayed ? ", Delayed" : "");
        }
    }
}
