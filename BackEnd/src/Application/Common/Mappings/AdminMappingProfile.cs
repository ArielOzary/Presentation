using AutoLog.Application.Admins.Queries.GetAdmins;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class AdminMappingProfile : Profile
{
    public AdminMappingProfile()
    {
        CreateMap<ApplicationUser, AdminDto>()
            .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.Company.NameEn))
            .ForMember(dest => dest.ContactEmail, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.Email))
            .ForMember(dest => dest.ContactPhoneNumber, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.PhoneNumber))
            .ForMember(dest => dest.ContactName, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.Name))
            .ForMember(dest => dest.ContactJobTitle, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.JobTitle));
    }
}
