using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.ShipmentStatuses.Commands.AddShipmentStatusChild;
using AutoLog.Application.ShipmentStatuses.Commands.DeleteShipmentStatus;
using AutoLog.Application.ShipmentStatuses.Commands.UpdateShipmentStatus;
using AutoLog.Application.ShipmentStatuses.Queries.GetShipmentStatusById;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/shipmentStatuses")]
public sealed class ShipmentStatusesController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_STATUS_NOT_FOUND FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost]
    public async Task<StatusCodeResult> AddChildToShipmentStatus([FromBody] AddShipmentStatusChildCommand command)
    {
        await Mediator.Send(command);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_STATUS_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpGet("{shipmentId}")]
    public async Task<ShipmentStatusDto?> GetShipmentStatus([FromRoute] string shipmentId)
    {
        return await Mediator.Send(new GetShipmentStatusByIdQuery { ShipmentId = shipmentId });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_STATUS_NOT_FOUND HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    public async Task<StatusCodeResult> DeleteShipmentStatus([FromRoute] int id)
    {
        await Mediator.Send(new DeleteShipmentStatusCommand { Id = id });

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_STATUS_NOT_FOUND FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPut("{id}")]
    public async Task<StatusCodeResult> UpdateShipmentStatus([FromRoute] int id, [FromBody] UpdateShipmentStatusCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

        return Ok();
    }
}
