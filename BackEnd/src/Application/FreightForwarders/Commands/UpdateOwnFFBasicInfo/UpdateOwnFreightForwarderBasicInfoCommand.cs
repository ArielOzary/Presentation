using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.ProviderInfo;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Commands.UpdateOwnFFBasicInfo;

public sealed class UpdateOwnFreightForwarderBasicInfoCommand : IRequest
{
    public CompanyFFProfileUpdateDto CompanyProfile { get; set; } = null!;

    public ProviderInfoUpdateDto ProviderInfo { get; set; } = null!;
}

public sealed class UpdateOwnFreightForwarderBasicInfoCommandHandler : IRequestHandler<UpdateOwnFreightForwarderBasicInfoCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateOwnFreightForwarderBasicInfoCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateOwnFreightForwarderBasicInfoCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company)
            .Include(x => x.ProviderInfo)
            .FirstOrDefaultAsync(x => x.Id == _currentUserService.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        _mapper.Map(request.CompanyProfile, user.Company);
        if (user.ProviderInfo is null)
        {
            user.ProviderInfo = _mapper.Map<ProviderInfo>(request.ProviderInfo);
            user.ProviderInfo.UserId = user.Id;
        }
        else
        {
            _mapper.Map(request.ProviderInfo, user.ProviderInfo);
        }

        user.PhoneNumber = request.CompanyProfile.PhoneNumber;

        _context.Users.Update(user);
        _context.Companies.Update(user.Company);
        _context.ProviderInfos.Update(user.ProviderInfo);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
