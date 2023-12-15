using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Quotes.Commands.UpdateQuoteCommand;

public sealed class UpdateQuoteCommand : IRequest
{
    public int CompanyId { get; set; }

    public ShippingTypeCreateDto ShippingType { get; set; } = null!;

    public ShippingLocationCreateDto Destination { get; set; } = null!;

    public ShippingLocationCreateDto Origin { get; set; } = null!;

    public QuoteGoodCreateDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadCreateDto> QuoteLoads { get; set; } = null!;

    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    [JsonIgnore]
    public int Id { get; set; }
}

public sealed class UpdateQuoteCommandHandler : IRequestHandler<UpdateQuoteCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateQuoteCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateQuoteCommand request, CancellationToken cancellationToken)
    {
        request.UserId = _currentUserService.UserId!;

        await UpdateQuoteAsync(request, cancellationToken);

        return Unit.Value;
    }

    private async Task<Quote> UpdateQuoteAsync(UpdateQuoteCommand request, CancellationToken cancellationToken)
    {
        var quote = await _context.Quotes
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.QUOTE_NOT_FOUND);

        _mapper.Map(request, quote);
        quote.CompanyId = request.CompanyId;

        _context.Quotes.Update(quote);
        await _context.SaveChangesAsync(cancellationToken);

        return quote;
    }
}
