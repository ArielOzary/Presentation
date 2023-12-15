using AutoLog.Application.Common.Constants;
using MassTransit;

namespace AutoLog.Application.Common.Dtos.Clients.ClientProfits;

[MessageUrn(MassTransitTypes.QuoteCalculationInfoRequestTypes.ClientChargeProfitsDto)]
public class ClientChargeProfitsDto
{
    public double FreightProfitCharge { get; set; }

    public bool IsRequiredCustomClearanceCharge { get; set; }

    public double CustomClearanceProfitCharge { get; set; }

    public double OriginProfitCharge { get; set; }

    public double DestinationProfitCharge { get; set; }
}
