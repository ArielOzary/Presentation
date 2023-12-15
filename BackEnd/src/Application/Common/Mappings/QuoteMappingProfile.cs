using AutoLog.Application.Common.Dtos;
using AutoLog.Application.Common.Dtos.Quotes.ClientQuotes;
using AutoLog.Application.Quotes.Commands.RequestCustomQuoteCommand;
using AutoLog.Application.Quotes.Commands.UpdateQuoteCommand;
using AutoLog.Application.Quotes.Queries.GetAvailableQuotes;
using AutoLog.Application.Shipments.Commands.CreateShipment;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class QuoteMappingProfile : Profile
{
    public QuoteMappingProfile()
    {
        CreateMap<RequestCustomQuoteCommand, Quote>();
        CreateMap<RequestCustomQuoteCommand, RecentQuoteSearch>()
            .ForMember(dest => dest.OriginId, opt => opt.MapFrom(src => src.Origin.PortId))
            .ForPath(dest => dest.Origin!.Country, opt => opt.MapFrom(src => src.Origin.Country))
            .ForPath(dest => dest.Origin!.PortId, opt => opt.MapFrom(src => src.Origin.PortId))
            .ForPath(dest => dest.Origin!.Address, opt => opt.MapFrom(src => src.Origin.Address))
            .ForPath(dest => dest.Origin!.City, opt => opt.MapFrom(src => src.Origin.City))
            .ForPath(dest => dest.Origin!.Zip, opt => opt.MapFrom(src => src.Origin.Zip))
            .ForMember(dest => dest.DestinationId, opt => opt.MapFrom(src => src.Destination.PortId))
            .ForPath(dest => dest.Destination!.Country, opt => opt.MapFrom(src => src.Destination.Country))
            .ForPath(dest => dest.Destination!.Address, opt => opt.MapFrom(src => src.Destination.Address))
            .ForPath(dest => dest.Destination!.City, opt => opt.MapFrom(src => src.Destination.City))
            .ForPath(dest => dest.Destination!.Zip, opt => opt.MapFrom(src => src.Destination.Zip))
            .ForPath(dest => dest.Destination!.PortId, opt => opt.MapFrom(src => src.Destination.PortId));
        CreateMap<GetAvailableQuotesQuery, RecentQuoteSearch>()
            .ForMember(dest => dest.OriginId, opt => opt.MapFrom(src => src.Origin.PortId))
            .ForPath(dest => dest.Origin!.Country, opt => opt.MapFrom(src => src.Origin.Country))
            .ForPath(dest => dest.Origin!.PortId, opt => opt.MapFrom(src => src.Origin.PortId))
            .ForPath(dest => dest.Origin!.Address, opt => opt.MapFrom(src => src.Origin.Address))
            .ForPath(dest => dest.Origin!.City, opt => opt.MapFrom(src => src.Origin.City))
            .ForPath(dest => dest.Origin!.Zip, opt => opt.MapFrom(src => src.Origin.Zip))
            .ForPath(dest => dest.Origin!.State, opt => opt.MapFrom(src => src.Origin.State))
            .ForMember(dest => dest.DestinationId, opt => opt.MapFrom(src => src.Destination.PortId))
            .ForPath(dest => dest.Destination!.Country, opt => opt.MapFrom(src => src.Destination.Country))
            .ForPath(dest => dest.Destination!.Address, opt => opt.MapFrom(src => src.Destination.Address))
            .ForPath(dest => dest.Destination!.City, opt => opt.MapFrom(src => src.Destination.City))
            .ForPath(dest => dest.Destination!.Zip, opt => opt.MapFrom(src => src.Destination.Zip))
            .ForPath(dest => dest.Destination!.PortId, opt => opt.MapFrom(src => src.Destination.PortId))
            .ForPath(dest => dest.Destination!.State, opt => opt.MapFrom(src => src.Destination.State));
        CreateMap<UpdateQuoteCommand, Quote>();
        CreateMap<Quote, ClientQuoteDto>()
            .ForMember(dest => dest.Files, opt => opt.MapFrom(src => src.QuoteFiles));
        CreateMap<RecentQuoteSearch, ClientSearchQuoteDto>();
        CreateMap<Quote, ClientCustomQuoteDto>()
            .ForMember(dest => dest.QuoteId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Files, opt => opt.MapFrom(src => src.QuoteFiles));
        CreateMap<CreateShipmentCommand, Quote>();
        CreateMap<Quote, CustomRequestedQuoteDto>()
            .ForMember(dest => dest.Locale, opt => opt.MapFrom(src => src.User != null ? src.User.Locale : string.Empty))
            .ForMember(dest => dest.Username,
                opt => opt.MapFrom(src => src.User != null ? src.User.Company.Contacts!
                .First(x => x.CompanyId == src.User.Company.Id && x.ContactType == CompanyContactType.Basic).Name : string.Empty));
    }
}
