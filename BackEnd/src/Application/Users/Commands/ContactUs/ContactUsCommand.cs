using AutoLog.Application.Common.Dtos.Emails.ContactUs;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AutoLog.Application.Users.Commands.ContactUs;

public sealed class ContactUsCommand : IRequest
{
    public string FirstName { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}

public sealed class ContactUsCommandHandler : IRequestHandler<ContactUsCommand>
{
    private readonly IEmailService _emailService;
    private readonly AwsSesOptions _awsSesConfig;
    private readonly ICurrentUserService _currentUserService;
    private readonly IApplicationDbContext _context;

    public ContactUsCommandHandler(
        IEmailService emailService,
        IOptions<AwsSesOptions> awsSesConfig,
        ICurrentUserService currentUserService,
        IApplicationDbContext applicationDbContext)
    {
        _emailService = emailService;
        _awsSesConfig = awsSesConfig.Value;
        _currentUserService = currentUserService;
        _context = applicationDbContext;
    }

    public async Task<Unit> Handle(ContactUsCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstAsync(x => x.Id == _currentUserService.UserId, cancellationToken);

        var emailDto = new ContactUsEmailDto
        {
            CompanyName = request.CompanyName,
            EmailAddress = request.Email,
            Phone = request.Phone,
            FirstName = request.FirstName,
            Message = request.Message,
            Email = _awsSesConfig.ContactUsEmail,
            Locale = user.Locale,
        };

        await _emailService.SendContactUsAsync(emailDto);

        return Unit.Value;
    }
}
