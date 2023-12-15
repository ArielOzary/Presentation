using AutoLog.Application.Common.Dtos.Company;
using AutoLog.Application.Companies.Queries.GetFFCompanyNames;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class CompanyMappingProfile : Profile
{
    public CompanyMappingProfile()
    {
        CreateMap<CompanyProfileUpdateDto, Company>();
        CreateMap<Company, CompanyProfileDto>();

        CreateMap<CompanyFFProfileUpdateDto, Company>();
        CreateMap<Company, CompanyFFProfileDto>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber));

        CreateMap<Company, FreightForwarderCompanyNameDto>()
            .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.NameEn));
    }
}
