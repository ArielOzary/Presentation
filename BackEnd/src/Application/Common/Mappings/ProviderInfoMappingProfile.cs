using AutoLog.Application.Common.Dtos.ProviderInfo;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class ProviderInfoMappingProfile : Profile
{
    public ProviderInfoMappingProfile()
    {
        CreateMap<ProviderInfo, ProviderInfoDisplayDto>();
        CreateMap<ProviderInfoUpdateDto, ProviderInfo>();
    }
}
