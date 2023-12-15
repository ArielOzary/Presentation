using AutoLog.Application.Common.Dtos.Shipments;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public sealed class ShipmentMappingProfile : Profile
{
    public ShipmentMappingProfile()
    {
        CreateMap<Shipment, ShipmentDto>()
            .Include<Shipment, ShipmentListDto>()
            .Include<Shipment, ShipmentDetailDto>()
            .ForMember(dest => dest.ConversationId, opt => opt.MapFrom(x => x.Conversation.Id))
            .ForMember(dest => dest.FreightForwarderId, opt => opt.MapFrom(src => src.Company != null ? src.Company.UserId : string.Empty))
            .ForMember(dest => dest.Profits, opt => opt.MapFrom(src => src.ShipmentTotalProfit))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Id!.Substring(0, 13)))
            .ForMember(dest => dest.ContainerNumberOrVesselName, opt => opt.MapFrom(src => src.ContainerNumberOrVesselName))
            .ForMember(dest => dest.IsDelayed, opt => opt.MapFrom(src => src.ShipmentStatuses.Any(x => x.Stage == ShipmentStatusStage.Delayed)))
            .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.Company != null ? src.Company.NameEn : string.Empty))
            .ForMember(dest => dest.DestinationPort, opt => opt.MapFrom(src => src.Quote != null && src.Quote.Destination != null ? src.Quote.Destination.Country : string.Empty))
            .ForMember(dest => dest.OriginPort, opt => opt.MapFrom(src => src.Quote != null && src.Quote.Origin != null ? src.Quote.Origin.Country : string.Empty))
            .ForMember(dest => dest.ArrivalDate, opt => opt.MapFrom(src => src.ETA))
            .ForMember(dest => dest.DepartedDate, opt => opt.MapFrom(src => src.ETD))
            .ForMember(dest => dest.Client,
                opt => opt.MapFrom(src => src.User != null && src.User!.Company.Contacts!
                .FirstOrDefault(x => x.CompanyId == src.User.Company.Id && x.ContactType == CompanyContactType.Basic) != null ? src.User.Company.Contacts!
                .First(x => x.CompanyId == src.User.Company.Id && x.ContactType == CompanyContactType.Basic).Name : string.Empty));

        CreateMap<Shipment, ShipmentListDto>()
            .ForMember(dest => dest.Profits, opt => opt.MapFrom(src => src.ShipmentTotalProfit))
            .ForMember(dest => dest.ShipmentStatusStage,
                opt => opt.MapFrom(src => src.ShipmentStatuses.OrderBy(x => x.Id).Last(x => x.Stage != ShipmentStatusStage.Delayed).Stage));

        CreateMap<Shipment, ShipmentDetailDto>()
            .ForMember(dest => dest.TotalWeight, opt => opt.Ignore())
            .ForMember(dest => dest.CBM, opt => opt.MapFrom(src => src.Quote != null && src.Quote.QuoteLoads != null ? src.Quote.QuoteLoads.Sum(x => x.CalculationOption == CalculationOption.TotalShipment ? x.Volume : x.Height * x.Length * x.Width) : 0))
            .ForMember(dest => dest.ContainerTypes, opt => opt.MapFrom(src => src.Quote != null && src.Quote.QuoteLoads != null ? src.Quote.QuoteLoads.Select(x => x.ContainerType) : default))
            .ForMember(dest => dest.Containers, opt => opt.MapFrom(src => src.Quote != null ? src.Quote.ShippingType!.ShipmentType.ToString() : string.Empty))
            .ForMember(dest => dest.Units, opt => opt.MapFrom(src => src.Quote != null && src.Quote.QuoteLoads != null ? src.Quote.QuoteLoads.Sum(x => x.UnitsQuantity) : 0));

        CreateMap<Shipment, ShipmentMapDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Id!.Substring(0, 13)))
            .ForMember(dest => dest.IsDelayed, opt => opt.MapFrom(src => src.ShipmentStatuses.Any(x => x.Stage == ShipmentStatusStage.Delayed)))
            .ForMember(dest => dest.ShipmentStatusStage,
                opt => opt.MapFrom(src => src.ShipmentStatuses.OrderBy(x => x.Id).Last(x => x.Stage != ShipmentStatusStage.Delayed).Stage))
            .ForMember(dest => dest.ShipmentOption, opt => opt.MapFrom(src => src.ShippingType!.ShipmentOption))
            .ForMember(dest => dest.OriginCountry, opt => opt.MapFrom(src => src.Quote != null && src.Quote.Origin != null ? src.Quote.Origin.Country : string.Empty))
            .ForMember(dest => dest.DestinationCountry, opt => opt.MapFrom(src => src.Quote != null && src.Quote.Destination != null ? src.Quote.Destination.Country : string.Empty))
            .ForMember(dest => dest.DestinationLatitude, opt => opt.MapFrom(src => src.Quote == null || src.Quote.Destination == null || src.Quote.Destination.Port == null ? 0.0 : src.Quote.Destination.Port.Latitude))
            .ForMember(dest => dest.DestinationLongitude, opt => opt.MapFrom(src => src.Quote == null || src.Quote.Destination == null || src.Quote.Destination.Port == null ? 0.0 : src.Quote.Destination.Port.Longitude))
            .ForMember(dest => dest.OriginLatitude, opt => opt.MapFrom(src => src.Quote == null || src.Quote.Origin == null || src.Quote.Origin.Port == null ? 0.0 : src.Quote.Origin.Port.Latitude))
            .ForMember(dest => dest.OriginLongitude, opt => opt.MapFrom(src => src.Quote == null || src.Quote.Origin == null || src.Quote.Origin.Port == null ? 0.0 : src.Quote.Origin.Port.Longitude));
    }
}
