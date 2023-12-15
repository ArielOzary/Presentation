using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.RateCharges;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Rates.Commands.UpdateRateCommand;

public sealed class UpdateRateCommand : IRequest
{
    [JsonIgnore]
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsDraft { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public ShippingTypeUpdateDto ShippingType { get; set; } = null!;

    public RateChargesUpdateDto? FreightCharges { get; set; }

    public RateChargesUpdateDto? OriginCharges { get; set; }

    public RateChargesUpdateDto? DestinationCharges { get; set; }

    public int? CarrierId { get; set; }
}

public sealed class UpdateRateCommandHanlder : IRequestHandler<UpdateRateCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IQuoteRateNotifierService _quoteRateNotifierService;

    public UpdateRateCommandHanlder(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IQuoteRateNotifierService quoteRateNotifierService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _quoteRateNotifierService = quoteRateNotifierService;
    }

    public async Task<Unit> Handle(UpdateRateCommand request, CancellationToken cancellationToken)
    {
        var rate = await _context.Rates
            .Where(x => x.Id == request.Id)
            .WhereIf(_currentUserService.Roles is not null && _currentUserService.Roles.Contains(Roles.FreightForwarder),
                x => x.CompanyId == _currentUserService.CompanyId)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.RATE_NOT_FOUND);

        _mapper.Map(request, rate);

        _context.Rates.Update(rate);
        await _context.SaveChangesAsync(cancellationToken);

        await _quoteRateNotifierService.CheckQuotesAsync(rate.CompanyId, cancellationToken);

        return Unit.Value;
    }
}
