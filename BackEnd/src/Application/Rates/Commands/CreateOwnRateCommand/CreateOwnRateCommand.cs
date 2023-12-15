using AutoLog.Application.Common.Dtos.RateCharges;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Newtonsoft.Json;

namespace AutoLog.Application.Rates.Commands.CreateOwnRateCommand;

public sealed class CreateOwnRateCommand : IRequest<int>
{
    public string Name { get; set; } = string.Empty;

    public bool IsDraft { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public ShippingTypeCreateDto ShippingType { get; set; } = null!;

    public RateChargesCreateDto? FreightCharges { get; set; }

    public RateChargesCreateDto? OriginCharges { get; set; }

    public RateChargesCreateDto? DestinationCharges { get; set; }

    public int? CarrierId { get; set; }

    [JsonIgnore]
    public int CompanyId { get; set; }
}

public sealed class CreateOwnRateCommandHandler : IRequestHandler<CreateOwnRateCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly IQuoteRateNotifierService _quoteRateNotifierService;

    public CreateOwnRateCommandHandler(IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IMapper mapper,
        IQuoteRateNotifierService quoteRateNotifierService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _mapper = mapper;
        _quoteRateNotifierService = quoteRateNotifierService;
    }

    public async Task<int> Handle(CreateOwnRateCommand request, CancellationToken cancellationToken)
    {
        request.CompanyId = _currentUserService.CompanyId!.Value;

        var rate = _mapper.Map<Rate>(request);

        _context.Rates.Add(rate);
        await _context.SaveChangesAsync(cancellationToken);

        //await _quoteRateNotifierService.CheckQuotesAsync(request.CompanyId, cancellationToken);

        return rate.Id;
    }
}