using AutoLog.Application.Common.Dtos.RateCharges;

namespace AutoLog.Application.Rates.Queries.GetRateChargesByIdQuery;

public sealed class RateChargesDetailsDto
{
    public RateChargesInfoDto? FreightCharges { get; set; }

    public RateChargesInfoDto? OriginCharges { get; set; }

    public RateChargesInfoDto? DestinationCharges { get; set; }
}
