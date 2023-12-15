using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Common.Dtos.ProviderInfo;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace AutoLog.Application.FreightForwarders.Commands.UpdateFFBasicInfo;

public sealed class UpdateFreightForwarderBasicInfoCommand : IRequest
{
    [JsonIgnore]
    public string UserId { get; set; } = string.Empty;

    public CompanyFFProfileUpdateDto CompanyProfile { get; set; } = null!;

    public ProviderInfoUpdateDto ProviderInfo { get; set; } = null!;
}

public sealed class UpdateFreightForwarderBasicInfoCommandHandler : IRequestHandler<UpdateFreightForwarderBasicInfoCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateFreightForwarderBasicInfoCommandHandler(IApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateFreightForwarderBasicInfoCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company)
            .Include(x => x.ProviderInfo)
            .Include(ur => ur.UserRoles)
                .ThenInclude(r => r.Role)
            .Where(x => x.Id == request.UserId && x.UserRoles.Any(r => r.Role.Name == Roles.FreightForwarder))
            .FirstOrDefaultAsync(cancellationToken)
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
