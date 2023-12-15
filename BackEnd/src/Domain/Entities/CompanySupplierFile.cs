namespace AutoLog.Domain.Entities;

public class CompanySupplierFile : BaseAttachmentFile, IBaseAuditableEntity
{
    public int CompanySupplierId { get; set; }

    public CompanySupplier CompanySupplier { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? LastModified { get; set; }

    public string? LastModifiedBy { get; set; }

    public CompanySupplierFile(string extension, string fileId, string name, int supplierId)
    {
        Extension = extension;
        FileId = fileId;
        Name = name;
        CompanySupplierId = supplierId;
    }

    public CompanySupplierFile()
    {
    }
}
