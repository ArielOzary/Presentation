using AutoLog.Application.Registration.Commands.FreightForwarderRegistration;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class FreightForwarderRegistrationMappingProfile : Profile
{
    public FreightForwarderRegistrationMappingProfile()
    {
        CreateMap<CompanyFreightForwarderRegistrationCommand, Company>();
        CreateMap<CompanyFreightForwarderRegistrationCommand, ApplicationUser>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => UserVerificationStatus.Verified))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email.ToLower()))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.ToLower()));
        CreateMap<ContactFreightForwarderRegistrationCommand, CompanyContact>();
        CreateMap<CompanyLocationFreightForwarderRegistrationCommand, CompanyLocation>()
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

        CreateMap<ProviderInfoFreightForwarderRegistrationCommand, ProviderInfo>();
    }
}
