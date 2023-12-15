using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.CompanySuppliers;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.CompanySuppliers.Queries.GetSupplierByIdQuery;

public sealed class GetCompanySupplierByIdQuery : IRequest<CompanySupplierDetailDto>
{
    public int Id { get; set; }
}

public sealed class GetCompanySupplierByIdQueryHandler : IRequestHandler<GetCompanySupplierByIdQuery, CompanySupplierDetailDto>
{
    private readonly IMapper _mapper;
    private readonly IApplicationDbContext _context;

    public GetCompanySupplierByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<CompanySupplierDetailDto> Handle(GetCompanySupplierByIdQuery request, CancellationToken cancellationToken)
    {
        var supplier = await _context.CompanySuppliers
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .ProjectTo<CompanySupplierDetailDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SUPPLIER_NOT_FOUND);

        return supplier;
    }
}
