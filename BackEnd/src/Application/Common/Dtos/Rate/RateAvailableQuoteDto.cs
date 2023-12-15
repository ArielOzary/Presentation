using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.RateCharges;
using AutoLog.Application.Common.Dtos.ShippingType;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.Rate;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.RateAvailableQuoteDto)]
public class RateAvailableQuoteDto
{
    public int Id { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Remarks { get; set; } = string.Empty;

    public ShippingTypeAvailableQuoteDto ShippingType { get; set; } = null!;

    public RateChargesInfoAvailableQuoteDto? FreightCharges { get; set; }

    public RateChargesInfoAvailableQuoteDto? OriginCharges { get; set; }

    public RateChargesInfoAvailableQuoteDto? DestinationCharges { get; set; }

    public int? CarrierId { get; set; }

    public string? CarrierName { get; set; }

    public int CompanyId { get; set; }

    public string CompanyName { get; set; } = string.Empty;
}
