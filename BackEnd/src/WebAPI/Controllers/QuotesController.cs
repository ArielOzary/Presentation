using AutoLog.Application.Common.Dtos.Quotes;
using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Quotes.Commands.AddRateToCustomQuoteCommand;
using AutoLog.Application.Quotes.Commands.RequestCustomQuoteCommand;
using AutoLog.Application.Quotes.Commands.UpdateQuoteCommand;
using AutoLog.Application.Quotes.Queries.GetAvailableQuotes;
using AutoLog.Application.Quotes.Queries.GetLatestQuotes;
using AutoLog.Application.Quotes.Queries.GetQuote;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/quotes")]
public sealed class QuotesController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost("request-custom")]
    public async Task<List<int>> CreateQuote([FromBody] RequestCustomQuoteCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet("{id}")]
    public async Task<ClientQuoteDto?> GetQuoteById([FromRoute] int id)
    {
        return await Mediator.Send(new GetQuoteByIdQuery { Id = id });
    }

    [HttpPost("available-list")]
    public async Task<AvailableQuotesListDto> GetAvailableQuotesList([FromBody] GetAvailableQuotesQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("own-latest")]
    public async Task<List<ClientSearchQuoteDto>> GetLatestQuotes()
    {
        return await Mediator.Send(new GetLatestQuotesQuery());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuote([FromRoute] int id, [FromBody] UpdateQuoteCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

        return Ok();
    }

    [HttpPut("{id}/add-rate")]
    public async Task<IActionResult> AddRateToCustomQuote([FromRoute] int id, [FromBody] AddRateToCustomQuoteCommand command)
    {
        command.QuoteId = id;
        await Mediator.Send(command);

        return Ok();
    }
}
