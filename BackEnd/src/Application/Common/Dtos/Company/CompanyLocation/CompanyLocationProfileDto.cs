namespace AutoLog.Application.Common.Dtos.Company.CompanyLocation;

public class CompanyLocationProfileDto
{
    public string MailingAddress { get; set; } = string.Empty;

    public string MailingApartment { get; set; } = string.Empty;

    public string MailingPostalCode { get; set; } = string.Empty;

    public string InLandAddress { get; set; } = string.Empty;

    public string InLandApartment { get; set; } = string.Empty;

    public string InLandPostalCode { get; set; } = string.Empty;

    public bool InLandByAutoLog { get; set; }

    public bool Insurance { get; set; }

    public string WhoIsInChargeOfInLand { get; set; } = string.Empty;

    public int? DestinationPortId { get; set; }

    public bool CustomClearenceByAutoLog { get; set; }

    public string Comments { get; set; } = string.Empty;
}
