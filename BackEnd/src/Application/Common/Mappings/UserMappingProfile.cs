using AutoLog.Application.Common.Dtos.ApplicationUser;
using AutoLog.Application.Common.Dtos.Roles;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(u => u.Roles, opt => opt.MapFrom(x => x.UserRoles.Select(x => x.Role)));

        CreateMap<ApplicationRole, RoleDto>();
    }
}
