using AutoLog.Application.Common.Dtos.CompanySuppliers;
using AutoLog.Application.Common.Dtos.Suppliers;
using AutoLog.Application.CompanySuppliers.Commands.CreateSupplier;
using AutoLog.Application.CompanySuppliers.Commands.UpdateSupplierCommand;
using AutoLog.Domain.Entities;
using AutoMapper;

namespace AutoLog.Application.Common.Mappings;

public sealed class CompanySupplierMappingProfile : Profile
{
    public CompanySupplierMappingProfile()
    {
        CreateMap<CreateCompanySupplierCommand, CompanySupplier>();
        CreateMap<UpdateCompanySupplierCommand, CompanySupplier>();
        CreateMap<CompanySupplier, CompanySupplierDto>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.CompanyPhoneNumber));
        CreateMap<CompanySupplier, CompanySupplierDetailDto>();
    }
}
