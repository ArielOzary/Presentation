using AutoLog.Application.Common.Dtos.Rate;
using AutoLog.Application.Rates.Commands.CreateOwnRateCommand;
using AutoLog.Application.Rates.Commands.CreateRateCommand;
using AutoLog.Application.Rates.Commands.UpdateRateCommand;
using AutoLog.Application.Rates.Queries.GetRatesWithPagingQuery;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class RateMappingProfile : Profile
{
    public RateMappingProfile()
    {
        CreateMap<CreateOwnRateCommand, Rate>();
        CreateMap<CreateRateCommand, Rate>();

        CreateMap<UpdateRateCommand, Rate>();

        CreateMap<Rate, RateDto>();

        CreateMap<Rate, RateAvailableQuoteDto>()
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.LastModified))
            .ForMember(dest => dest.CarrierName, opt => opt.MapFrom(src => src.Carrier!.NameEn))
            .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Company!.NameEn));
    }
}
