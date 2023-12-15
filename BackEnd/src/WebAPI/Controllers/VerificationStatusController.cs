using AutoLog.Application.Users.Queries;
using AutoLog.Domain.Enums;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/verification")]
public sealed class VerificationStatusController : ApiControllerBase
{
    [HttpGet("status")]
    public async Task<UserVerificationStatus> GetUserVerificationStatus([FromQuery] GetVerificationStatusQuery query)
    {
        return await Mediator.Send(query);
    }
}
