using AutoLog.Application.Ports.Queries;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class PortMappingProfile : Profile
{
    public PortMappingProfile()
    {
        CreateMap<Port, PortDto>();
    }
}
