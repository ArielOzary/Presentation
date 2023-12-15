using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.Quotes.Commands.AddRateToCustomQuoteCommand;

public sealed class AddRateToCustomQuoteCommand : IRequest
{
    [JsonIgnore]
    public int QuoteId { get; set; }

    public int RateId { get; set; }
}

public sealed class AddRateToCustomQuoteCommandHandler : IRequestHandler<AddRateToCustomQuoteCommand>
{
    private readonly IApplicationDbContext _context;

    public AddRateToCustomQuoteCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(AddRateToCustomQuoteCommand request, CancellationToken cancellationToken)
    {
        _ = await _context.Rates.FirstOrDefaultAsync(x => x.Id == request.RateId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.RATE_NOT_FOUND);

        var executed = await _context.Quotes
            .Where(x => x.Id == request.QuoteId)
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.RateId, request.RateId), cancellationToken);

        if (executed == 0)
            throw new AutoLogException(ErrorCodes.QUOTE_NOT_FOUND);

        return Unit.Value;
    }
}