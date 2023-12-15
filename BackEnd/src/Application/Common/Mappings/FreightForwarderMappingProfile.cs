using AutoLog.Application.Companies.Queries.GetFFCompanyNames;
using AutoLog.Application.Companies.Queries.GetFFDtoByCompanyId;
using AutoLog.Application.FreightForwarders.Queries.GetFFBasicInfoById;
using AutoLog.Application.FreightForwarders.Queries.GetFFContactsById;
using AutoLog.Application.FreightForwarders.Queries.GetFFLocationById;
using AutoLog.Application.FreightForwarders.Queries.GetFreightForwarders;
using AutoLog.Application.FreightForwarders.Queries.GetOwnFFBasicInfo;
using AutoLog.Application.FreightForwarders.Queries.GetOwnFFContacts;
using AutoLog.Application.FreightForwarders.Queries.GetOwnFFLocation;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class FreightForwarderMappingProfile : Profile
{
    public FreightForwarderMappingProfile()
    {
        CreateMap<ApplicationUser, FreightForwarderDto>()
            .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.Company.NameEn))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Fax, opt => opt.MapFrom(src => src.Company.Fax))
            .ForMember(dest => dest.PaymentContact, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Payment)))
            .ForMember(dest => dest.ProviderInfo, opt => opt.MapFrom(src => src.ProviderInfo));

        CreateMap<ApplicationUser, FreightForwarderCompanyDto>()
            .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.Company.NameEn))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Fax, opt => opt.MapFrom(src => src.Company.Fax))
            .ForMember(dest => dest.CompanyId, opt => opt.MapFrom(src => src.Company.Id));

        CreateMap<ApplicationUser, FreightForwarderBasicInfoDto>()
            .ForMember(dest => dest.ProviderInfo, opt => opt.MapFrom(src => src.ProviderInfo))
            .ForMember(dest => dest.CompanyProfile, opt => opt.MapFrom(src => src.Company));

        CreateMap<ApplicationUser, FreightForwarderContactsDto>()
            .ForMember(dest => dest.CompanyContacts, opt => opt.MapFrom(src => src.Company.Contacts));

        CreateMap<ApplicationUser, FreightForwarderLocationDto>()
            .ForMember(dest => dest.CompanyLocation, opt => opt.MapFrom(src => src.Company.Location));

        CreateMap<ApplicationUser, OwnFreightForwarderBasicInfoDto>()
            .ForMember(dest => dest.ProviderInfo, opt => opt.MapFrom(src => src.ProviderInfo))
            .ForMember(dest => dest.CompanyProfile, opt => opt.MapFrom(src => src.Company));

        CreateMap<ApplicationUser, OwnFreightForwarderContactsDto>()
            .ForMember(dest => dest.CompanyContacts, opt => opt.MapFrom(src => src.Company.Contacts));

        CreateMap<ApplicationUser, OwnFreightForwarderLocationDto>()
            .ForMember(dest => dest.CompanyLocation, opt => opt.MapFrom(src => src.Company.Location));

        CreateMap<ApplicationUser, FreightForwarderCompanyNameDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Company.Id))
            .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.Company.NameEn));
    }
}
