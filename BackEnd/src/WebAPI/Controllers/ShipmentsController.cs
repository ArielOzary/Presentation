using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.Common.Models;
using AutoLog.Application.Shipments.Commands.AddContainerNumberOrVesselName;
using AutoLog.Application.Shipments.Commands.CreateShipment;
using AutoLog.Application.Shipments.Commands.DeleteShipment;
using AutoLog.Application.Shipments.Commands.MergeShipments;
using AutoLog.Application.Shipments.Commands.UpdateShipment;
using AutoLog.Application.Shipments.Queries.GetShipmentById;
using AutoLog.Application.Shipments.Queries.GetShipments;
using AutoLog.Application.Shipments.Queries.GetShipmentsForMap;
using AutoLog.Application.Shipments.Queries.GetShipmentsIds;
using AutoLog.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Authorize]
[Route("api/shipments")]
public sealed class ShipmentsController : ApiControllerBase
{
    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  RATE_NOT_FOUND FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPost]
    public async Task<string> CreateShipment([FromBody] CreateShipmentCommand command)
    {
        var id = await Mediator.Send(command);

        return id;
    }

    [HttpPost("list")]
    public async Task<PaginatedList<ShipmentListDto>> GetShipments([FromBody] GetShipmentsQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPost("map-list")]
    public async Task<List<ShipmentMapDto>> GetShipmentsForMap([FromBody] GetShipmentsForMapQuery query)
    {
        return await Mediator.Send(query);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND HAS_NO_ACCESS
    ///</para>
    ///</remarks>
    [HttpGet("{id}")]
    public async Task<ShipmentDetailDto?> GetShipment([FromRoute] string id)
    {
        return await Mediator.Send(new GetShipmentByIdQuery { Id = id });
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND 
    ///</para>
    ///</remarks>
    [HttpDelete("{id}")]
    [Authorize(Policy = Policies.AdminRights)]
    public async Task<StatusCodeResult> DeleteShipment([FromRoute] string id, [FromBody] DeleteShipmentCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND, USER_NOT_FOUND
    ///</para>
    ///</remarks>
    [HttpPut("{id}")]
    public async Task<StatusCodeResult> UpdateShipment([FromRoute] string id, [FromBody] UpdateShipmentCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

        return Ok();
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPut("{id}/tracking-name")]
    public async Task<StatusCodeResult> AddContainerNumberOrVesselName([FromRoute] string id, [FromBody] AddContainerNumberOrVesselNameCommand command)
    {
        command.Id = id;
        await Mediator.Send(command);

        return Ok();
    }

    [HttpGet("ids")]
    public async Task<PaginatedList<string>> GetShipmentIds([FromQuery] GetShipmentsIdsQuery query)
    {
        return await Mediator.Send(query);
    }

    /// <remarks>
    ///<para>
    ///  Exception Codes:
    ///</para>
    ///<para>
    ///  SHIPMENT_NOT_FOUND FIELD_REQUIRED
    ///</para>
    ///</remarks>
    [HttpPut("merge")]
    public async Task<StatusCodeResult> MergeShipments([FromBody] MergeShipmentsCommand query)
    {
        await Mediator.Send(query);

        return Ok();
    }
}
