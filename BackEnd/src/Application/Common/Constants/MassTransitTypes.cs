namespace AutoLog.Application.Common.Constants;

public static class MassTransitTypes
{
    public static class QuoteCalculationInfoRequestTypes
    {
        public const string Type = "QuoteCalculationInfoRequest";

        public const string ShippingLocationAvailableQuoteDto = "ShippingLocationAvailableQuoteDto";

        public const string ShippingTypeAvailableQuoteDto = "ShippingTypeAvailableQuoteDto";

        public const string RateAvailableQuoteDto = "RateAvailableQuoteDto";

        public const string QuoteGoodAvailableQuoteDto = "QuoteGoodAvailableQuoteDto";

        public const string QuoteLoadAvailableQuoteDto = "QuoteLoadAvailableQuoteDto";

        public const string RateChargesInfoAvailableQuoteDto = "RateChargesInfoAvailableQuoteDto";

        public const string ClientChargeProfitsDto = "ClientChargeProfitsDto";
    }

    public static class AvailableQuotesRequestTypes
    {
        public const string Type = "NewAvailableQuotesCalculationRequest";

        public const string CustomRequestedQuoteDto = "CustomRequestedQuoteDto";
    }

    public static class QuoteCalculationAvailableListResponseTypes
    {
        public const string Type = "QuoteCalculationAvailableListResponse";

        public const string QuoteDto = "QuoteDto";

        public const string QuoteFees = "QuoteFees";

        public const string QuoteFeeItem = "QuoteFeeItem";
    }

    public static class AvailableQuotesResponseTypes
    {
        public const string Type = "NewAvailableQuotesCalculationResponse";
    }

    public static class MassTransitExceptionResponseTypes
    {
        public const string Type = "MassTransitExceptionResponse";
    }
}
