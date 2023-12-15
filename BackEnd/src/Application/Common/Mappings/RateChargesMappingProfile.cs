using AutoLog.Application.Common.Dtos.RateCharges;
using AutoLog.Application.Rates.Queries.GetRateChargesByIdQuery;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class RateChargesMappingProfile : Profile
{
    public RateChargesMappingProfile()
    {
        CreateMap<RateChargesCreateDto, RateCharges>();
        CreateMap<RateChargesUpdateDto, RateCharges>();

        CreateMap<RateCharges, RateChargesInfoDto>();
        CreateMap<Rate, RateChargesDetailsDto>();

        CreateMap<RateCharges, RateChargesInfoAvailableQuoteDto>();
    }
}
