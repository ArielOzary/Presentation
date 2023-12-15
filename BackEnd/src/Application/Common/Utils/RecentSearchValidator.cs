using AutoLog.Application.Quotes.Queries.GetAvailableQuotes;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Common.Utils;

public static class RecentSearchValidator
{
    public static bool IsSameQuoteLoads(GetAvailableQuotesQuery request, RecentQuoteSearch? recentSearch)
    {
        var isQuoteLoad = false;

        if (recentSearch.QuoteLoads.Count != request.QuoteLoads.Count)
        {
            return isQuoteLoad;
        }

        foreach (var quoteLoad in recentSearch.QuoteLoads)
        {
            if (!request.QuoteLoads.Any(x => x.DimensionsFormat == quoteLoad.DimensionsFormat
                    && x.CalculationOption == quoteLoad.CalculationOption
                    && x.UnitsQuantity == quoteLoad.UnitsQuantity
                    && x.WeightPerUnit == quoteLoad.WeightPerUnit
                    && x.ContainerType == quoteLoad.ContainerType
                    && x.PackageType == quoteLoad.PackageType
                    && x.Width == quoteLoad.Width
                    && x.WeightFormat == quoteLoad.WeightFormat
                    && x.Weight == quoteLoad.Weight
                    && x.VolumeFormat == quoteLoad.VolumeFormat
                    && x.Volume == quoteLoad.Volume
                    && x.Length == quoteLoad.Length
                    && x.Height == quoteLoad.Height))
            {
                isQuoteLoad = false;
                break;
            }

            isQuoteLoad = true;
        }

        return isQuoteLoad;
    }

    public static bool IsSameQuoteGood(GetAvailableQuotesQuery request, RecentQuoteSearch? recentSearch)
    {
        return recentSearch.QuoteGood.Dangerous == request.QuoteGood.Dangerous
            && recentSearch.QuoteGood.CurrencyType == request.QuoteGood.CurrencyType
            && recentSearch.QuoteGood.ShippingDate == request.QuoteGood.ShippingDate
            && recentSearch.QuoteGood.UN == request.QuoteGood.UN
            && recentSearch.QuoteGood.Value == request.QuoteGood.Value
            && recentSearch.QuoteGood.IsKnownShipper == request.QuoteGood.IsKnownShipper;
    }

    public static bool IsSameOrigin(GetAvailableQuotesQuery request, RecentQuoteSearch? recentSearch)
    {
        return recentSearch.Origin.Country == request.Origin.Country && (recentSearch.Origin.Port?.Name == request.Origin.PortName || recentSearch.Origin.PortId == request.Origin.PortId)
            && recentSearch.Origin.Zip == request.Origin.Zip && recentSearch.Origin.Address == request.Origin.Address 
            && recentSearch.Origin.City == request.Origin.City && recentSearch.Origin.State == request.Origin.State;
    }

    public static bool IsSameDestination(GetAvailableQuotesQuery request, RecentQuoteSearch? recentSearch)
    {
        return recentSearch.Destination.Country == request.Destination.Country && (recentSearch.Destination.Port?.Name == request.Destination.PortName || recentSearch.Destination.PortId == request.Destination.PortId)
            && recentSearch.Destination.Zip == request.Destination.Zip && recentSearch.Destination.Address == request.Destination.Address
            && recentSearch.Destination.City == request.Destination.City && recentSearch.Destination.State == request.Destination.State;
    }

    public static bool IsSameShippingType(GetAvailableQuotesQuery request, RecentQuoteSearch? recentSearch)
    {
        return recentSearch.ShippingType.ShipmentIncoterms == request.ShippingType.ShipmentIncoterms && recentSearch.ShippingType.ShipmentOption == request.ShippingType.ShipmentOption
            && recentSearch.ShippingType.ShipmentType == request.ShippingType.ShipmentType && recentSearch.ShippingType.Insurance == request.ShippingType.Insurance
            && recentSearch.ShippingType.Customs == request.ShippingType.Customs;
    }
}
