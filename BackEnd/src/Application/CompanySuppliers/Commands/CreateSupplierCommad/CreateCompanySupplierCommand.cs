using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;

namespace AutoLog.Application.CompanySuppliers.Commands.CreateSupplier;

public sealed class CreateCompanySupplierCommand : IRequest<int>
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
}

public sealed class CreateCompanySupplierCommandHandler : IRequestHandler<CreateCompanySupplierCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateCompanySupplierCommandHandler(
        IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(CreateCompanySupplierCommand request, CancellationToken cancellationToken)
    {
        var newSupplier = _mapper.Map<CompanySupplier>(request);
        newSupplier.UserId = _currentUserService.UserId!;

        await _context.CompanySuppliers.AddAsync(newSupplier, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return newSupplier.Id;
    }
}
