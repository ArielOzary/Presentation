using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Dtos.Suppliers;

namespace AutoLog.Application.Common.Dtos.CompanySuppliers;

public sealed class CompanySupplierDetailDto : CompanySupplierDto
{
    public string CompanyAddress { get; set; } = string.Empty;

    public string CompanyApartment { get; set; } = string.Empty;

    public string CompanyPostalCode { get; set; } = string.Empty;

    public string CompanyPhoneNumber { get; set; } = string.Empty;

    public string? Comments { get; set; }

    public DateTime Created { get; set; }

    public List<CompanySupplierFileDto> Files { get; set; } = new();
}
