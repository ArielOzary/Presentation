using AutoLog.Application.Registration.Commands.AdminInvitation;
using AutoLog.Application.Registration.Commands.AdminRegistration;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class AdminRegistrationMapping : Profile
{
    public AdminRegistrationMapping()
    {
        CreateMap<AdminInvitationCommand, ApplicationUser>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<AdminRegistrationCommand, Company>()
            .ForMember(dest => dest.NameEn, opt => opt.MapFrom(src => src.CompanyName));

        CreateMap<AdminRegistrationCommand, CompanyContact>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.CompanyName))
            .ForMember(dest => dest.Fax, opt => opt.MapFrom(src => src.Fax))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.JobTitle, opt => opt.MapFrom(src => src.JobTitle));
    }
}
