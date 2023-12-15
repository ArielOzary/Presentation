using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.IndustryTypes.Queries;

public sealed class GetIndustryTypesListQuery : IRequest<List<IndustryTypeDto>>
{
}

public sealed class GetIndustryTypesListQueryHandler : IRequestHandler<GetIndustryTypesListQuery, List<IndustryTypeDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetIndustryTypesListQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<IndustryTypeDto>> Handle(GetIndustryTypesListQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.IndustryTypes
            .AsNoTracking()
            .ProjectToListAsync<IndustryTypeDto>(_mapper.ConfigurationProvider);

        return result;
    }
}
