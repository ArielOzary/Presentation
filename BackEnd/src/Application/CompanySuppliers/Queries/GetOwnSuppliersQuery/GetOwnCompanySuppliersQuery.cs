using AutoLog.Application.Common.Dtos.Suppliers;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.CompanySuppliers.Queries.GetOwnSuppliersQuery;

public sealed class GetOwnCompanySuppliersQuery : IRequest<PaginatedList<CompanySupplierDto>>
{
    public int PageNumber { get; init; } = 1;

    public int PageSize { get; init; } = 10;
}

public sealed class GetOwnCompanySuppliersQueryHandler : IRequestHandler<GetOwnCompanySuppliersQuery, PaginatedList<CompanySupplierDto>>
{
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;

    public GetOwnCompanySuppliersQueryHandler(
        ICurrentUserService currentUserService,
        IMapper mapper,
        IApplicationDbContext context)
    {
        _currentUserService = currentUserService;
        _mapper = mapper;
        _context = context;
    }

    public async Task<PaginatedList<CompanySupplierDto>> Handle(GetOwnCompanySuppliersQuery request, CancellationToken cancellationToken)
    {
        var result = await _context.CompanySuppliers
            .AsNoTracking()
            .OrderByDescending(x => x.Created)
            .Where(x => x.UserId == _currentUserService.UserId)
            .ProjectTo<CompanySupplierDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.PageNumber, request.PageSize);

        return result;
    }
}
