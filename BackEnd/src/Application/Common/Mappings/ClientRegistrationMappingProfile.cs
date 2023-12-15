using AutoLog.Application.Common.Dtos.Registration;
using AutoLog.Application.Registration.Commands.ClientRegistration;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;
public class ClientRegistrationMappingProfile : Profile
{
    public ClientRegistrationMappingProfile()
    {
        CreateMap<CompanyClientRegistrationCommand, Company>();
        CreateMap<CompanyClientRegistrationCommand, UserRegistrationDto>();
        CreateMap<UserRegistrationDto, ApplicationUser>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => UserVerificationStatus.Pending))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email.ToLower()))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.ToLower()));
        CreateMap<ContactClientRegistrationCommand, CompanyContact>();
        CreateMap<CompanyLocationClientRegistrationCommand, CompanyLocation>()
            .ForMember(dest => dest.InLandAuthority, opt => opt.MapFrom(src => src.WhoIsInChargeOfInLand))
            .ForMember(dest => dest.CustomClearance, opt => opt.MapFrom(src => src.CustomClearenceByAutoLog))
            .ForMember(dest => dest.MadeBySystem, opt => opt.MapFrom(src => src.InLandByAutoLog))
            .ForMember(dest => dest.InLandAddress, opt => opt.MapFrom(src => new CompanyLocationAddress
            {
                Address = src.InLandAddress,
                Apartment = src.InLandApartment,
                PostalCode = src.InLandPostalCode,
            }))
            .ForMember(dest => dest.MailingAddress, opt => opt.MapFrom(src => new CompanyLocationAddress
            {
                Address = src.MailingAddress,
                Apartment = src.MailingApartment,
                PostalCode = src.MailingPostalCode,
            }));
    }
}
