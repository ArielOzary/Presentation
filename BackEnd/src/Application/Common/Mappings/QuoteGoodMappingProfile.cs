using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class QuoteGoodMappingProfile : Profile
{
    public QuoteGoodMappingProfile()
    {
        CreateMap<QuoteGoodCreateDto, QuoteGood>();
        CreateMap<QuoteGood, QuoteGoodDto>();
        CreateMap<QuoteGood, QuoteGoodAvailableQuoteDto>().ReverseMap();
    }
}
