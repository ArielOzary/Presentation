using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class CompanyContactMappingProfile : Profile
{
    public CompanyContactMappingProfile()
    {
        CreateMap<CompanyContact, CompanyContactProfileDto>();
        CreateMap<CompanyContactProfileUpdateDto, CompanyContact>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<CompanyContact, CompanyContactClientProfileDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
        CreateMap<CompanyContactClientProfileUpdateDto, CompanyContact>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
    }
}
