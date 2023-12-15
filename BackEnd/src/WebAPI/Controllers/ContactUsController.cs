using AutoLog.Application.Users.Commands.ContactUs;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/contactus")]
public sealed class ContactUsController : ApiControllerBase
{
    [HttpPost]
    public async Task<StatusCodeResult> ContactUs([FromBody] ContactUsCommand request)
    {
        await Mediator.Send(request);

        return Ok();
    }
}
