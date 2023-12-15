using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class ShippingTypeMappingProfile : Profile
{
    public ShippingTypeMappingProfile()
    {
        CreateMap<ShippingType, ShippingTypeDto>();

        CreateMap<ShippingTypeCreateDto, ShippingType>();

        CreateMap<ShippingType, ShippingTypeAvailableQuoteDto>().ReverseMap();
    }
}
