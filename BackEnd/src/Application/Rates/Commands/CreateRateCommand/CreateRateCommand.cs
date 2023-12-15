using AutoLog.Application.Common.Dtos.RateCharges;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;

namespace AutoLog.Application.Rates.Commands.CreateRateCommand;

public sealed class CreateRateCommand : IRequest<int>
{
    public string Name { get; set; } = string.Empty;

    public bool IsDraft { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public ShippingTypeCreateDto ShippingType { get; set; } = null!;

    public RateChargesCreateDto? FreightCharges { get; set; }

    public RateChargesCreateDto? OriginCharges { get; set; }

    public RateChargesCreateDto? DestinationCharges { get; set; }

    public int? CarrierId { get; set; }

    public int CompanyId { get; set; }
}

public sealed class CreateRateCommandHandler : IRequestHandler<CreateRateCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IQuoteRateNotifierService _quoteRateNotifierService;

    public CreateRateCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        IQuoteRateNotifierService quoteRateNotifierService)
    {
        _context = context;
        _mapper = mapper;
        _quoteRateNotifierService = quoteRateNotifierService;
    }

    public async Task<int> Handle(CreateRateCommand request, CancellationToken cancellationToken)
    {
        var rate = _mapper.Map<Rate>(request);

        _context.Rates.Add(rate);
        await _context.SaveChangesAsync(cancellationToken);

        await _quoteRateNotifierService.CheckQuotesAsync(request.CompanyId, cancellationToken);
        return rate.Id;
    }
}
