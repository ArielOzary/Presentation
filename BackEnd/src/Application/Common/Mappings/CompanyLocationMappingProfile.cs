using AutoLog.Application.Common.Dtos.Company.CompanyLocation;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class CompanyLocationMappingProfile : Profile
{
    public CompanyLocationMappingProfile()
    {
        CreateMap<CompanyLocationProfileUpdateDto, CompanyLocation>()
            .ForMember(dest => dest.InLandAuthority, opt => opt.MapFrom(src => src.WhoIsInChargeOfInLand))
            .ForMember(dest => dest.CustomClearance, opt => opt.MapFrom(src => src.CustomClearenceByAutoLog))
            .ForMember(dest => dest.MadeBySystem, opt => opt.MapFrom(src => src.InLandByAutoLog))
            .ForPath(dest => dest.InLandAddress.Address, opt => opt.MapFrom(src => src.InLandAddress))
            .ForPath(dest => dest.InLandAddress.Apartment, opt => opt.MapFrom(src => src.InLandApartment))
            .ForPath(dest => dest.InLandAddress.PostalCode, opt => opt.MapFrom(src => src.InLandPostalCode))
            .ForPath(dest => dest.MailingAddress.Address, opt => opt.MapFrom(src => src.MailingAddress))
            .ForPath(dest => dest.MailingAddress.Apartment, opt => opt.MapFrom(src => src.MailingApartment))
            .ForPath(dest => dest.MailingAddress.PostalCode, opt => opt.MapFrom(src => src.MailingPostalCode));

        CreateMap<CompanyLocation, CompanyLocationProfileDto>()
            .ForMember(dest => dest.WhoIsInChargeOfInLand, opt => opt.MapFrom(src => src.InLandAuthority))
            .ForMember(dest => dest.CustomClearenceByAutoLog, opt => opt.MapFrom(src => src.CustomClearance))
            .ForMember(dest => dest.InLandByAutoLog, opt => opt.MapFrom(src => src.MadeBySystem))
            .ForMember(dest => dest.MailingAddress, opt => opt.MapFrom(src => src.MailingAddress.Address))
            .ForMember(dest => dest.MailingApartment, opt => opt.MapFrom(src => src.MailingAddress.Apartment))
            .ForMember(dest => dest.MailingPostalCode, opt => opt.MapFrom(src => src.MailingAddress.PostalCode))
            .ForMember(dest => dest.InLandAddress, opt => opt.MapFrom(src => src.InLandAddress.Address))
            .ForMember(dest => dest.InLandApartment, opt => opt.MapFrom(src => src.InLandAddress.Apartment))
            .ForMember(dest => dest.InLandPostalCode, opt => opt.MapFrom(src => src.InLandAddress.PostalCode));

        CreateMap<CompanyLocation, CompanyLocationFFProfileDto>()
            .ForMember(dest => dest.MailingAddress, opt => opt.MapFrom(src => src.MailingAddress.Address))
            .ForMember(dest => dest.MailingApartment, opt => opt.MapFrom(src => src.MailingAddress.Apartment))
            .ForMember(dest => dest.MailingPostalCode, opt => opt.MapFrom(src => src.MailingAddress.PostalCode))
            .ForMember(dest => dest.InLandAddress, opt => opt.MapFrom(src => src.InLandAddress.Address))
            .ForMember(dest => dest.InLandApartment, opt => opt.MapFrom(src => src.InLandAddress.Apartment))
            .ForMember(dest => dest.InLandPostalCode, opt => opt.MapFrom(src => src.InLandAddress.PostalCode));

        CreateMap<CompanyLocationFFProfileUpdateDto, CompanyLocation>()
            .ForPath(dest => dest.InLandAddress.Address, opt => opt.MapFrom(src => src.InLandAddress))
            .ForPath(dest => dest.InLandAddress.Apartment, opt => opt.MapFrom(src => src.InLandApartment))
            .ForPath(dest => dest.InLandAddress.PostalCode, opt => opt.MapFrom(src => src.InLandPostalCode))
            .ForPath(dest => dest.MailingAddress.Address, opt => opt.MapFrom(src => src.MailingAddress))
            .ForPath(dest => dest.MailingAddress.Apartment, opt => opt.MapFrom(src => src.MailingApartment))
            .ForPath(dest => dest.MailingAddress.PostalCode, opt => opt.MapFrom(src => src.MailingPostalCode));
    }
}
