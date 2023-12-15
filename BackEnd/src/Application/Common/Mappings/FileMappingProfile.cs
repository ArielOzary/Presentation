using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Extensions;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class FileMappingProfile : Profile
{
    public FileMappingProfile()
    {
        CreateMap<QuoteFile, FileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<ShipmentFile, FileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<MessageFile, FileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<CompanySupplierFile, FileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));

        CreateMap<QuoteFile, QuoteFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<CompanySupplierFile, CompanySupplierFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<ShipmentFile, ShipmentFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<MessageFile, MessageFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));

        CreateMap<CompanySupplierFile, FileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));

        CreateMap<QuoteFile, QuoteFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<CompanySupplierFile, CompanySupplierFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
        CreateMap<ShipmentFile, ShipmentFileDto>()
           .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.GetMediaType()));
    }
}
