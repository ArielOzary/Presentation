using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class ShippingLocationMappingProfile : Profile
{
    public ShippingLocationMappingProfile()
    {
        CreateMap<ShippingLocationCreateDto, ShippingLocation>();
        CreateMap<ShippingLocation, ShippingLocationDto>();
        CreateMap<ShippingLocation, ShippingLocationAvailableQuoteDto>().ReverseMap();
    }
}
