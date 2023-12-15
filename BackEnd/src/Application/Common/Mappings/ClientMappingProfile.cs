using AutoLog.Application.Clients.Commands.UpdateClientProfile;
using AutoLog.Application.Clients.Commands.UpdateClientProfits;
using AutoLog.Application.Clients.Commands.UpdateOwnClientProfile;
using AutoLog.Application.Clients.Queries.GetClientProfileById;
using AutoLog.Application.Clients.Queries.GetClientProfitsById;
using AutoLog.Application.Clients.Queries.GetClientsWithShipments;
using AutoLog.Application.Clients.Queries.GetOwnClientProfile;
using AutoLog.Application.Common.Dtos.Clients;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;
public class ClientMappingProfile : Profile
{
    public ClientMappingProfile()
    {
        CreateMap<ApplicationUser, ClientProfileDto>()
            .ForMember(dest => dest.TotalProfit, opt => opt.MapFrom(src => src.ClientProfits != null && src.Shipments != null ?
                src.Shipments.Where(x => x.ShipmentStatuses.Any(x => x.Stage == ShipmentStatusStage.Delivered)).Sum(x => x.ShipmentTotalProfit) : 0))
            .ForMember(dest => dest.CompanyProfile, opt => opt.MapFrom(src => src.Company))
            .ForMember(dest => dest.CompanyContact, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)))
            .ForMember(dest => dest.CompanyLocation, opt => opt.MapFrom(src => src.Company.Location));

        CreateMap<UpdateClientProfileCommand, ApplicationUser>()
            .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.CompanyProfile))
            .ForPath(dest => dest.Company.Location, opt => opt.MapFrom(src => src.CompanyLocation));

        CreateMap<ApplicationUser, ClientDto>()
           .Include<ApplicationUser, ExportClientDto>()
           .ForMember(dest => dest.HasCustomQuote, opt => opt.MapFrom(src => src.Quotes.Any(x => x.IsCustom)))
           .ForMember(dest => dest.TotalProfit, opt => opt.MapFrom(src => src.ClientProfits != null && src.Shipments != null ?
               src.Shipments.Where(x => x.ShipmentStatuses.Any(x => x.Stage == ShipmentStatusStage.Delivered)).Sum(x => x.ShipmentTotalProfit) : 0))
           .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.Company.NameEn))
           .ForMember(dest => dest.ContactEmail, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.Email))
           .ForMember(dest => dest.ContactPhoneNumber, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.PhoneNumber))
           .ForMember(dest => dest.ContactName, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.Name))
           .ForMember(dest => dest.ContactJobTitle, opt => opt.MapFrom(src => src.Company.Contacts!.FirstOrDefault(x => x.ContactType == Domain.Enums.CompanyContactType.Basic)!.JobTitle));

        CreateMap<ApplicationUser, ExportClientDto>();

        CreateMap<ApplicationUser, ClientShipmentDto>()
            .ForMember(dest => dest.CompanyNameEn, opt => opt.MapFrom(src => src.Company.NameEn));

        CreateMap<ClientProfits, ClientProfitsDto>();
        CreateMap<UpdateClientProfitsCommand, ClientProfits>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore());

        CreateMap<ApplicationUser, OwnClientProfileDto>()
            .ForMember(dest => dest.TotalProfit, opt => opt.MapFrom(src => src.ClientProfits != null && src.Shipments != null ?
                src.Shipments.Where(x => x.ShipmentStatuses.Any(x => x.Stage == ShipmentStatusStage.Delivered)).Sum(x => x.ShipmentTotalProfit) : 0))
            .ForMember(dest => dest.CompanyProfile, opt => opt.MapFrom(src => src.Company))
            .ForMember(dest => dest.CompanyContacts, opt => opt.MapFrom(src => src.Company.Contacts))
            .ForMember(dest => dest.CompanyLocation, opt => opt.MapFrom(src => src.Company.Location));

        CreateMap<UpdateOwnClientProfileCommand, ApplicationUser>()
            .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.CompanyProfile))
            .ForPath(dest => dest.Company.Contacts, opt => opt.MapFrom(src => src.CompanyContacts))
            .ForPath(dest => dest.Company.Location, opt => opt.MapFrom(src => src.CompanyLocation));
    }
}
