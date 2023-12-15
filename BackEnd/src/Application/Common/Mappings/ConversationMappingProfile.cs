using AutoLog.Application.Common.Dtos.Chats;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public sealed class ConversationMappingProfile : Profile
{
    public ConversationMappingProfile()
    {
        CreateMap<Conversation, ConversationDto>()
            .ForMember(dest => dest.UserIds, opt => opt.MapFrom(src => src.Users.Select(x => x.Id)));
    }
}
