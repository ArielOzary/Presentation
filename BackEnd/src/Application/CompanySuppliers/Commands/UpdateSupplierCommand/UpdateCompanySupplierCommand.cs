using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.CompanySuppliers.Commands.UpdateSupplierCommand;

public sealed class UpdateCompanySupplierCommand : IRequest
{
    public string ContactName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string CompanyAddress { get; set; } = string.Empty;

    public string CompanyApartment { get; set; } = string.Empty;

    public string CompanyPostalCode { get; set; } = string.Empty;

    public string CompanyPhoneNumber { get; set; } = string.Empty;

    public string? Comments { get; set; }

    [JsonIgnore]
    public int Id { get; set; }
}

public sealed class UpdateCompanySupplierCommandHandler : IRequestHandler<UpdateCompanySupplierCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCompanySupplierCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateCompanySupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _context.CompanySuppliers.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.SUPPLIER_NOT_FOUND);

        if (_currentUserService.UserId != supplier.CreatedBy && !_currentUserService.Roles!.Contains(Roles.Admin))
            throw new AutoLogException(ErrorCodes.HAS_NO_ACCESS);

        _mapper.Map(request, supplier);

        _context.CompanySuppliers.Update(supplier);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}