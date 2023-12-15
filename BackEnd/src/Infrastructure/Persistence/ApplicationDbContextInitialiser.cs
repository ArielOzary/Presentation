using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AutoLog.Infrastructure.Persistence;

/// <summary>
/// Db context initializer
/// </summary>
public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ICsvFileBuilder _csvFileBuilder;
    private readonly IPortsSeeder _portsSeeder;
    private readonly IWebHostEnvironment _environment;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        ICsvFileBuilder csvFileBuilder,
        IPortsSeeder portsSeeder,
        IWebHostEnvironment environment)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _csvFileBuilder = csvFileBuilder;
        _portsSeeder = portsSeeder;
        _environment = environment;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        if (!_environment.IsDevelopment())
        {
            await AddIndustryTypesAsync();
            await SeedOceanPortsAsync();

            //await AddAirPortsAsync();
            await _portsSeeder.SeedAsync(CancellationToken.None);
        }

        // Default roles
        var administratorRole = new ApplicationRole { Name = Roles.Admin };
        var clientRole = new ApplicationRole { Name = Roles.Client };
        var freightForwarderRole = new ApplicationRole { Name = Roles.FreightForwarder };

        await AddRoleIfNotExistingAsync(administratorRole);
        await AddRoleIfNotExistingAsync(clientRole);
        await AddRoleIfNotExistingAsync(freightForwarderRole);

        // Default users

        await _context.SaveChangesAsync();
    }

    private async Task AddIndustryTypesAsync()
    {
        if (!await _context.IndustryTypes.AnyAsync())
        {
            var list = _csvFileBuilder.ReadBaseIndustryTypes();
            await _context.IndustryTypes.AddRangeAsync(list);
        }
    }

    private async Task AddRoleIfNotExistingAsync(ApplicationRole role)
    {
        if (_roleManager.Roles.All(r => r.Name != role.Name))
        {
            await _roleManager.CreateAsync(role);
        }
    }

    private async Task SeedOceanPortsAsync()
    {
        var oldPorts = await _context.Ports.Where(x => x.PortType == Domain.Enums.PortType.Ocean && x.Created < new DateTime(2023, 10, 18)).ToListAsync();
        _context.Ports.RemoveRange(oldPorts);

        var portsList = _csvFileBuilder.ReadNewPorts();
        foreach (var port in portsList)
        {
            if (await _context.Ports.AnyAsync(x => x.Country.ToLower() == port.Country.ToLower() && x.PortType == Domain.Enums.PortType.Ocean &&
                                                                x.Name.ToLower().Contains(port.Name.ToLower())))
            {
                continue;
            }
            else
            {
                await _context.Ports.AddAsync(port);
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task AddAirPortsAsync()
    {
        using var transaction = _context.Database.BeginTransaction();

        _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Ports On;");

        var airPortsList = _csvFileBuilder.ReadBaseAirPorts();
        foreach (var port in airPortsList)
        {
            if (_context.Ports.All(x => x.Id != port.Id))
            {
                await _context.Ports.AddAsync(port);
            }
        }

        var portsList = _csvFileBuilder.ReadBaseOceanPorts();
        foreach (var port in portsList)
        {
            if (_context.Ports.All(x => x.Id != port.Id))
            {
                await _context.Ports.AddAsync(port);
            }
        }

        _context.SaveChanges();

        _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.Ports Off;");

        transaction.Commit();
    }

    private async Task AddAdminAsync(string userEmail, string userPassword, string roleName = Roles.Admin)
    {
        if (_userManager.Users.All(u => u.Email == userEmail))
        {
            return;
        }

        var newUser = new ApplicationUser()
        {
            PhoneNumber = "3800000",
            Email = userEmail,
            UserName = userEmail,
            Locale = Locales.English
        };

        var password = userPassword;
        newUser.PasswordHash = _userManager.PasswordHasher.HashPassword(newUser, password);

        newUser.Status = Domain.Enums.UserVerificationStatus.Verified;
        newUser.Company = new Company
        {
            Email = newUser.Email,
            Fax = "00000",
            LegalNumber = "00000",
            NameEn = "Admin Company",
        };

        var contact = new CompanyContact
        {
            Email = newUser.Email,
            Fax = "00000",
            JobTitle = "Admin",
            Name = "Admin",
            PhoneNumber = newUser.PhoneNumber,
        };

        contact.Email = newUser.Email;
        newUser.Company.Contacts = new List<CompanyContact>()
        {
            contact
        };

        await _userManager.CreateAsync(newUser);

        await _userManager.AddToRolesAsync(newUser, new[] { roleName });
    }
}
