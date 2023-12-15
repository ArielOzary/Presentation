using System.IO;
using AutoLog.Application.Clients.Commands.ExportClientProfile;
using AutoLog.Application.Clients.Commands.UpdateClientProfile;
using AutoLog.Application.Clients.Commands.UpdateClientProfits;
using AutoLog.Application.Clients.Commands.UpdateOwnClientProfile;
using AutoLog.Application.Clients.Queries.GetClientProfileById;
using AutoLog.Application.Clients.Queries.GetClientProfitsById;
using AutoLog.Application.Clients.Queries.GetClients;
using AutoLog.Application.Clients.Queries.GetClientsWithShipments;
using AutoLog.Application.Clients.Queries.GetOwnClientProfile;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Clients;
using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Models;
using AutoLog.Application.Quotes.Queries.GetClientCustomQuotes;
using AutoLog.Application.Quotes.Queries.GetClientQuotes;
using AutoLog.Application.Users.Commands.HardDeleteUser;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/clients")]
public sealed class ClientsController : ApiControllerBase
{
    private readonly IFileService _fileService;

    public ClientsController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet("{id}/profile")]
    public async Task<ClientProfileDto?> GetClientProfile([FromRoute] string id)
    {
        return await Mediator.Send(new GetClientProfileByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}/profile")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> UpdateClientProfile([FromRoute] string id, [FromBody] UpdateClientProfileCommand command)
    {
        command.UserId = id;
        await Mediator.Send(command);

        return Ok();
    }

    [HttpGet("{id}/profits")]
    public async Task<ClientProfitsDto?> GetClientProfits([FromRoute] string id)
    {
        return await Mediator.Send(new GetClientProfitsByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpPost("company-name-list")]
    public async Task<PaginatedList<ClientShipmentDto>> GetClientsCompanyNames([FromBody] GetClientsWithShipmentsQuery command)
    {
        return await Mediator.Send(command);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}/profits")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> UpdateClientProfits([FromRoute] string id, [FromBody] UpdateClientProfitsCommand command)
    {
        command.UserId = id;
        await Mediator.Send(command);

        return Ok();
    }

    [HttpGet]
    [Authorize(Policy = Policies.FreightForwarderOrAdminRights)]
    public async Task<PaginatedList<ClientDto>> GetClients([FromQuery] GetClientsWithPagingQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("own-profile")]
    public async Task<OwnClientProfileDto?> GetOwnClientProfile()
    {
        return await Mediator.Send(new GetOwnClientProfileQuery());
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("own-profile")]
    public async Task<StatusCodeResult> UpdateOwnClientProfile([FromBody] UpdateOwnClientProfileCommand command)
    {
        await Mediator.Send(command);
        return Ok();
    }

    [HttpDelete("own-profile")]
    public async Task<StatusCodeResult> RemoveOwnClientProfile()
    {
        await Mediator.Send(new HardDeleteUserCommand());

        return Ok();
    }

    [HttpGet("{id}/quotes")]
    public async Task<PaginatedList<ClientQuoteDto>> GetClientQuotes([FromRoute] string id, [FromQuery] GetClientQuotesQueryModel query)
    {
        return await Mediator.Send(new GetClientQuotesQuery(query, id));
    }

    [HttpGet("{id}/custom-quotes")]
    public async Task<PaginatedList<ClientCustomQuoteDto>> GetClientCustomQuotes([FromRoute] string id, [FromQuery] GetClientCustomQuotesQueryModel query)
    {
        return await Mediator.Send(new GetClientCustomQuotesQuery(query, id));
    }

    [HttpGet("{id}/export")]
    [Authorize(Policy = Policies.FreightForwarderOrAdminRights)]
    public async Task<IActionResult> ExportClient([FromRoute] string id)
    {
        var result = await Mediator.Send(new ExportClientProfileCommand { UserId = id });

        var file = new FormFile(result.Stream, 0, result.Stream.Length, result.FileName, result.FileName);
        var fileId = await _fileService.CreateAsync(file, result.ContentType);

        var fileLink = await _fileService.GetAsync(fileId);

        return Ok(fileLink);
    }

    //[HttpGet("{id}/shipments")]
    //public async Task<PaginatedList<ClientQuoteDto>> GetClientShipments([FromQuery] GetClientQuotesQuery query)
    //{
    //    return await Mediator.Send(query);
    //}
}
