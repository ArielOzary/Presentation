using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Utils;

public static class MassConverter
{
    const double KgInOneTON = 1000;
    const double KgInOneLBS = 2.205;

    public static double ConvertToKG(WeightFormat weightFormat, double value)
    {
        return weightFormat switch
        {
            WeightFormat.TON => value * KgInOneTON,
            WeightFormat.lbs => value / KgInOneLBS,
            WeightFormat.KG => value,
            _ => throw new NotImplementedException(),
        };
    }
}
