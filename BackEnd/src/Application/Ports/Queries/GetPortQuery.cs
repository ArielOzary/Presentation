using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Ports.Queries;

public sealed class GetPortQuery : IRequest<PortDto>
{
    public int Id { get; set; }
}

public sealed class GetPortQueryHandler : IRequestHandler<GetPortQuery, PortDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPortQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PortDto> Handle(GetPortQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.Ports
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .OrderBy(x => x.Name)
            .ProjectTo<PortDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.PORT_NOT_FOUND);

        return result;
    }
}
