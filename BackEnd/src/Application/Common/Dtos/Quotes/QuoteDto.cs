using AutoLog.Domain.Enums;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.Quotes;

[MessageUrn(Constants.MassTransitTypes.QuoteCalculationAvailableListResponseTypes.QuoteDto)]
public class QuoteDto
{
    public int RateId { get; set; }

    public bool IsKnownSupplier { get; set; }

    public DateTime RateUpdatedAt { get; set; }

    public ShipmentOption ShipmentOption { get; set; }

    public DateTime? EndDate { get; set; }

    public int TransitionTime { get; set; }

    public string? Remarks { get; set; }

    public QuoteFees? OriginFees { get; set; }

    public QuoteFees? FreightFees { get; set; }

    public QuoteFees? DestinatonsFees { get; set; }

    public QuoteFees? CustomClearanceFees { get; set; }

    public int? CarrierId { get; set; }

    public string CarrierName { get; set; } = string.Empty;

    public int CompanyId { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public double TotalAmout => (OriginFees != null ? OriginFees.SubTotal : default) +
                                    (FreightFees != null ? FreightFees.SubTotal : default) +
                                        (DestinatonsFees != null ? DestinatonsFees.SubTotal : default) +
                                            (CustomClearanceFees != null ? CustomClearanceFees.SubTotal : default);
}
