using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class QuoteLoadMappingProfile : Profile
{
    public QuoteLoadMappingProfile()
    {
        CreateMap<QuoteLoadCreateDto, QuoteLoad>();
        CreateMap<QuoteLoad, QuoteLoadDto>();
        CreateMap<QuoteLoad, QuoteLoadAvailableQuoteDto>().ReverseMap();
    }
}
