using AutoLog.Application.IndustryTypes.Queries;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class IndustryTypeMappingProfile : Profile
{
    public IndustryTypeMappingProfile()
    {
        CreateMap<IndustryType, IndustryTypeDto>();
    }
}
