using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company.CompanyLocation;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Commands.UpdateOwnFFLocation;

public sealed class UpdateOwnFreightForwarderLocationCommand : IRequest
{
    public CompanyLocationFFProfileUpdateDto CompanyLocation { get; set; } = null!;
}

public sealed class UpdateOwnFreightForwarderLocationCommandHandler : IRequestHandler<UpdateOwnFreightForwarderLocationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateOwnFreightForwarderLocationCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateOwnFreightForwarderLocationCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company.Location!.InLandAddress)
            .Include(x => x.Company.Location!.MailingAddress)
            .FirstOrDefaultAsync(x => x.Id == _currentUserService.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        _mapper.Map(request.CompanyLocation, user.Company.Location);

        _context.CompanyLocations.Update(user.Company.Location!);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}