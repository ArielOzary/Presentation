using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Models;
using AutoLog.Application.Rates.Commands.CreateOwnRateCommand;
using AutoLog.Application.Rates.Commands.CreateRateCommand;
using AutoLog.Application.Rates.Commands.UpdateRateCommand;
using AutoLog.Application.Rates.Queries.GetOwnRatesPagingQuery;
using AutoLog.Application.Rates.Queries.GetRateByIdQuery;
using AutoLog.Application.Rates.Queries.GetRateChargesByIdQuery;
using AutoLog.Application.Rates.Queries.GetRatesWithPagingQuery;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/rates")]
public sealed class RatesController : ApiControllerBase
{
    [HttpGet]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<PaginatedList<RateDto>> GetRates([FromQuery] GetRatesWithPagingQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("own")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<PaginatedList<RateDto>> GetOwnRates([FromQuery] GetOwnRatesPagingQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("{id}/charges")]
    [Authorize(Policy = Policies.FreightForwarderOrAdminRights)]
    public async Task<RateChargesDetailsDto?> GetRateDetails([FromRoute] int id)
    {
        return await Mediator.Send(new GetRateChargesByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<int> CreateRate([FromBody] CreateRateCommand command)
    {
        return await Mediator.Send(command);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost("own")]
    [Authorize(Policy = Policies.FreightForwarderRights)]
    public async Task<int> CreateOwnRate([FromBody] CreateOwnRateCommand command)
    {
        return await Mediator.Send(command);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  RATE_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id:int}")]
    [Authorize(Policy = Policies.FreightForwarderOrAdminRights)]
    public async Task<IActionResult> UpdateRate([FromRoute] int id, [FromBody] UpdateRateCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);
        return Ok();
    }

    [HttpGet("{id:int}")]
    [Authorize(Policy = Policies.FreightForwarderOrAdminRights)]
    public async Task<RateDto?> GetRateById([FromRoute] int id)
    {
        return await Mediator.Send(new GetRateByIdQuery { Id = id });
    }
}
