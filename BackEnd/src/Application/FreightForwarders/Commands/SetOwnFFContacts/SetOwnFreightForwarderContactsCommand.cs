using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.FreightForwarders.Commands.SetOwnFFContacts;

public sealed class SetOwnFreightForwarderContactsCommand : IRequest
{
    public List<CompanyContactProfileUpdateDto> CompanyContacts { get; set; } = null!;
}

public sealed class SetOwnFreightForwarderContactsCommandHandler : IRequestHandler<SetOwnFreightForwarderContactsCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public SetOwnFreightForwarderContactsCommandHandler(IApplicationDbContext context,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(SetOwnFreightForwarderContactsCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.Company)
                .ThenInclude(c => c.Contacts)
            .FirstOrDefaultAsync(x => x.Id == _currentUserService.UserId, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.USER_NOT_FOUND);

        var exisitingEntities = user.Company.Contacts;

        var newContacts = _mapper.Map<List<CompanyContact>>(request.CompanyContacts.Where(x => x.Id == default));
        foreach (var item in newContacts)
        {
            item.CompanyId = user.Company.Id;
        }

        UpdateContacts(request, exisitingEntities);
        await _context.CompanyContacts.AddRangeAsync(newContacts, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }

    private void UpdateContacts(SetOwnFreightForwarderContactsCommand request, List<CompanyContact>? exisitingEntities)
    {
        var contactsToRemove = exisitingEntities!.Where(s => request.CompanyContacts.All(x => x.Id != s.Id));

        var contactsToUpdate = exisitingEntities!.Where(s => request.CompanyContacts.Any(x => x.Id == s.Id)).ToList();
        for (int i = 0; i < contactsToUpdate.Count; i++)
        {
            var contactToUpdate = contactsToUpdate[i];
            var updatedContact = request.CompanyContacts.FirstOrDefault(x => x.Id == contactToUpdate.Id);
            if (updatedContact is not null)
            {
                contactsToUpdate[i] = _mapper.Map(updatedContact, contactToUpdate);
            }
        }

        _context.CompanyContacts.RemoveRange(contactsToRemove);
        _context.CompanyContacts.UpdateRange(contactsToUpdate);
    }
}