using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Application.ShipmentStatuses.Commands.UpdateShipmentStatus;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public sealed class ShipmentStatusMappingProfile : Profile
{
    public ShipmentStatusMappingProfile()
    {
        CreateMap<ShipmentStatus, ShipmentStatusDto>()
            .ForMember(dest => dest.ChildrenShipmentStatuses, opt => opt.MapFrom(src => src.ChildrenShipmentStatuses))
            .ForMember(dest => dest.ParentShipmentStatusId, opt => opt.MapFrom(src => src.ParentShipmentStatusId));

        CreateMap<UpdateShipmentStatusCommand, ShipmentStatus>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember is not null));
    }
}
