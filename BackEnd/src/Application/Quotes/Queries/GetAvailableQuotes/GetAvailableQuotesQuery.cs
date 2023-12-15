using AutoLog.Application.Common.Dtos.Clients.ClientProfits;
using AutoLog.Application.Common.Dtos.Quotes;
using AutoLog.Application.Common.Dtos.Quotes.QuoteGoods;
using AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;
using AutoLog.Application.Common.Dtos.Rate;
using AutoLog.Application.Common.Dtos.ShippingLocation;
using AutoLog.Application.Common.Dtos.ShippingType;
using AutoLog.Application.Common.Extensions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Mappings;
using AutoLog.Application.Common.MassTransit.Requests;
using AutoLog.Application.Common.Utils;
using AutoLog.Application.Companies.Queries.GetFFCompanyNames;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Enums;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Application.Quotes.Queries.GetAvailableQuotes;

public sealed class GetAvailableQuotesQuery : IRequest<AvailableQuotesListDto>
{
    public bool IsKnownSupplier { get; set; }

    public ShippingTypeAvailableQuoteDto ShippingType { get; set; } = null!;

    public ShippingLocationAvailableQuoteDto Destination { get; set; } = null!;

    public ShippingLocationAvailableQuoteDto Origin { get; set; } = null!;

    public QuoteGoodAvailableQuoteDto QuoteGood { get; set; } = null!;

    public List<QuoteLoadAvailableQuoteDto> QuoteLoads { get; set; } = null!;

    public AvailableQuotesFilterDto? Filters { get; set; }

    public string UserId { get; set; } = string.Empty;
}

public sealed class GetAvailableQuotesQueryHandler : IRequestHandler<GetAvailableQuotesQuery, AvailableQuotesListDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMassTransitService _massTransitService;
    private readonly ICurrencyExchangeRateService _currencyExchangeRateService;
    private readonly ICurrentUserService _currentUserService;

    public GetAvailableQuotesQueryHandler(IApplicationDbContext context,
        IMapper mapper,
        IMassTransitService massTransitService,
        ICurrencyExchangeRateService currencyExchangeRateService,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _mapper = mapper;
        _massTransitService = massTransitService;
        _currencyExchangeRateService = currencyExchangeRateService;
        _currentUserService = currentUserService;
    }

    public async Task<AvailableQuotesListDto> Handle(GetAvailableQuotesQuery request, CancellationToken cancellationToken)
    {
        // To be able to calculate quote by given request we need to find rates according to request
        var rates = await _context.Rates.Where(x => !x.IsDraft &&
                            x.StartDate <= request.QuoteGood.ShippingDate && request.QuoteGood.ShippingDate <= x.EndDate &&
                            x.ShippingType!.ShipmentIncoterms == request.ShippingType.ShipmentIncoterms &&
                            x.ShippingType.ShipmentType == request.ShippingType.ShipmentType &&
                            x.ShippingType.ShipmentOption == request.ShippingType.ShipmentOption)
            .ProjectToListAsync<RateAvailableQuoteDto>(_mapper.ConfigurationProvider);

        var massTransitRequest = new QuoteCalculationInfoRequest
        {
            ShippingType = request.ShippingType,
            Destination = request.Destination,
            Origin = request.Origin,
            QuoteGood = request.QuoteGood,
            QuoteLoads = request.QuoteLoads,
            Rates = rates,
        };

        //if (string.IsNullOrEmpty(request.UserId))
        //    request.UserId = _currentUserService.UserId!;

        await SaveRecentSearchAsync(request, cancellationToken);

        return await GetAvailableQuotesAsync(request, massTransitRequest, cancellationToken);
    }

    private async Task SaveRecentSearchAsync(GetAvailableQuotesQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserId))
            request.UserId = _currentUserService.UserId!;


        var recentSearches = await _context.RecentQuoteSearchs
            .Include(x => x.Origin).ThenInclude(x => x.Port)
            .Include(x => x.Destination).ThenInclude(x => x.Port)
            .Include(x => x.QuoteLoads)
            .Include(x => x.ShippingType)
            .Include(x => x.QuoteGood)
            .Where(x => x.CreatedBy == request.UserId)
            //.OrderByDescending(x => x.LastModified)
            //.Take(5)
            .ToListAsync(cancellationToken);

        foreach (var recentSearch in recentSearches)
        {
            var isSameShippingType = RecentSearchValidator.IsSameShippingType(request, recentSearch);

            if (!isSameShippingType)
                continue;

            var isSameOrigin = RecentSearchValidator.IsSameOrigin(request, recentSearch);

            if (!isSameOrigin)
                continue;

            var isSameDestination = RecentSearchValidator.IsSameDestination(request, recentSearch);

            if (!isSameDestination)
                continue;

            var isSameQuoteGood = RecentSearchValidator.IsSameQuoteGood(request, recentSearch);

            if (!isSameQuoteGood)
                continue;

            var isSameQuoteLoad = RecentSearchValidator.IsSameQuoteLoads(request, recentSearch);

            if (isSameOrigin && isSameDestination && isSameShippingType && isSameQuoteLoad && recentSearch.IsKnownSupplier == request.IsKnownSupplier)
            {
                recentSearch.LastModified = DateTime.UtcNow;
                _context.RecentQuoteSearchs.Update(recentSearch);
                await _context.SaveChangesAsync(cancellationToken);
                return;
            }
        }

        var newRecentSearch = _mapper.Map<RecentQuoteSearch>(request);

        await _context.RecentQuoteSearchs.AddAsync(newRecentSearch, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<AvailableQuotesListDto> GetAvailableQuotesAsync(GetAvailableQuotesQuery request, QuoteCalculationInfoRequest massTransitRequest, CancellationToken cancellationToken)
    {
        var clientProfits = await GetQuoteClientProfitsAsync(request, cancellationToken);
        massTransitRequest.ClientChargeProfits = clientProfits;

        // Calculations are done in quotes calculation API
        var availableQuotes = await _massTransitService.SendRequestToQuotesCalculationAsync(massTransitRequest);

        GetPriceRanges(request, availableQuotes, out double minPriceFilterOption, out double maxPriceFilterOption);

        var mergedIds = GetAllCompanyIds(availableQuotes);

        // Also in case if user want to filter quotes even more we need to filter them by filters coming from request
        availableQuotes = ExecuteFiltering(request, availableQuotes);

        var companyNames = await _context.Companies
            .Where(c => mergedIds.Any(m => m == c.Id))
            .ProjectToListAsync<FreightForwarderCompanyNameDto>(_mapper.ConfigurationProvider);

        availableQuotes.ForEach(x =>
        {
            x.CompanyName = companyNames.FirstOrDefault(c => c.Id == x.CompanyId)?.CompanyNameEn!;
            x.CarrierName = companyNames.FirstOrDefault(c => c.Id == x.CarrierId)?.CompanyNameEn!;
            x.IsKnownSupplier = request.IsKnownSupplier;
        });

        return new AvailableQuotesListDto
        {
            Quotes = availableQuotes,
            CompanyIdsFilterOptions = companyNames,
            MinPriceFilterOption = minPriceFilterOption,
            MaxPriceFilterOption = maxPriceFilterOption
        };
    }

    private void GetPriceRanges(GetAvailableQuotesQuery request, List<QuoteDto> availableQuotes, out double minPriceFilterOption, out double maxPriceFilterOption)
    {
        if (request.Filters is not null)
            ConvertingCurrency(request, availableQuotes);

        minPriceFilterOption = availableQuotes.Any() ? availableQuotes.Min(x => x.TotalAmout) : default;
        maxPriceFilterOption = availableQuotes.Any() ? availableQuotes.Max(x => x.TotalAmout) : default;
    }

    private static List<int> GetAllCompanyIds(List<QuoteDto> availableQuotes)
    {
        var companyIds = availableQuotes.Select(x => x.CompanyId).ToList();
        var carrierIds = availableQuotes.Where(x => x.CarrierId.HasValue).Select(x => x.CarrierId!.Value).ToList();
        var mergedIds = companyIds.Union(carrierIds).ToList();
        return mergedIds;
    }

    private static List<QuoteDto> ExecuteFiltering(GetAvailableQuotesQuery request, List<QuoteDto> availableQuotes)
    {
        if (request.Filters is not null)
        {
            availableQuotes = availableQuotes
                .WhereIf(request.Filters.CompanyIdsFilter is not null && request.Filters.CompanyIdsFilter.Options.Any(),
                    x => x.CarrierId.HasValue && request.Filters.CompanyIdsFilter!.Options.Any(c => c == x.CompanyId))
                .WhereIf(request.Filters.ExpirationDateFilter is not null,
                    x => x.EndDate?.Date == request.Filters.ExpirationDateFilter!.Value.Date)
                .ToList();

            if (!string.IsNullOrWhiteSpace(request.Filters.SearchQuery?.Query))
            {
                var searchQuery = request.Filters.SearchQuery?.Query.ToLower()!;
                availableQuotes = availableQuotes.Where(x => x.CompanyName.ToLower().Contains(searchQuery)).ToList();
            }

            //ToDo Maybe move that filter to quoteCaclApi

            availableQuotes = FilteringByPriceRange(request, availableQuotes);

            availableQuotes = SortingFilter(request, availableQuotes);

            availableQuotes = ShipmentOptionsFilter(request, availableQuotes);
        }

        return availableQuotes;
    }

    private static List<QuoteDto> FilteringByPriceRange(GetAvailableQuotesQuery request, List<QuoteDto> availableQuotes)
    {
        if (request.Filters!.PriceRangeFilter is not null)
        {
            availableQuotes = availableQuotes
                .WhereIf(request.Filters.PriceRangeFilter.From.HasValue,
                        x => request.Filters.PriceRangeFilter.From!.Value <= x.TotalAmout)
                .WhereIf(request.Filters.PriceRangeFilter.To.HasValue,
                        x => x.TotalAmout <= request.Filters.PriceRangeFilter.To!.Value)
                .ToList();
        }

        return availableQuotes;
    }

    private void ConvertingCurrency(GetAvailableQuotesQuery request, List<QuoteDto> availableQuotes)
    {
        var targetCurrency = request.Filters!.CurrencyTypeFilter is not null ? request.Filters.CurrencyTypeFilter.Value : CurrencyType.USD;

        availableQuotes.ForEach(x =>
        {
            ConvertQuoteFees(x.OriginFees, targetCurrency);
            ConvertQuoteFees(x.FreightFees, targetCurrency);
            ConvertQuoteFees(x.DestinatonsFees, targetCurrency);
        });
    }

    private void ConvertQuoteFees(QuoteFees? quoteFees, CurrencyType targetCurrency)
    {
        if (quoteFees != null && quoteFees.Items?.Count() > 0)
        {
            quoteFees?.Items.ForEach(d =>
            {
                SetCurrencyConversion(d, targetCurrency);
            });
        }
    }
    private void SetCurrencyConversion(QuoteFeeItem d, CurrencyType targetCurrency)
    {
        if (d != null)
        {
            d.Amount = _currencyExchangeRateService.ConvertFromToCurrency(d.Currency, targetCurrency, d.Amount);
            d.UnitPrice = _currencyExchangeRateService.ConvertFromToCurrency(d.Currency, targetCurrency, d.UnitPrice);
        }
    }
    private static List<QuoteDto> SortingFilter(GetAvailableQuotesQuery request, List<QuoteDto> availableQuotes)
    {
        availableQuotes = request.Filters!.SortingFilter switch
        {
            AvailableQuotesSortOption.LastModified => availableQuotes.OrderByCondition(x => x.RateUpdatedAt, request.Filters.SortDescending).ToList(),
            AvailableQuotesSortOption.Price => availableQuotes.OrderByCondition(x => x.TotalAmout, request.Filters.SortDescending).ToList(),
            _ => availableQuotes.OrderByDescending(x => x.EndDate).ToList()
        };

        return availableQuotes;
    }

    private static List<QuoteDto> ShipmentOptionsFilter(GetAvailableQuotesQuery request, List<QuoteDto> availableQuotes)
    {
        if (request.Filters!.ShipmentOptions is not null)
        {
            availableQuotes = availableQuotes.Where(x => request.Filters.ShipmentOptions.Contains(x.ShipmentOption)).ToList();
        }

        return availableQuotes;
    }

    private async Task<ClientChargeProfitsDto> GetQuoteClientProfitsAsync(GetAvailableQuotesQuery request, CancellationToken cancellationToken)
    {
        var clientProfit = await _context.ClientProfits.FirstOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken);
        var isRequiredCustomClearance = await _context.Companies.Include(x => x.Location)
            .Where(x => x.UserId == request.UserId)
            .Select(x => x.Location.CustomClearance).FirstOrDefaultAsync(cancellationToken);

        var quoteFreightProfitCharge = 0.0;
        var customClearance = 0.0;

        if (clientProfit != null)
        {
            quoteFreightProfitCharge = request.ShippingType.ShipmentOption switch
            {
                ShipmentOption.Air => quoteFreightProfitCharge += clientProfit.Air,
                ShipmentOption.Ocean => quoteFreightProfitCharge = request.ShippingType.ShipmentType switch
                {
                    ShipmentType.LCL => quoteFreightProfitCharge += clientProfit.LCL,
                    ShipmentType.FCL => quoteFreightProfitCharge += clientProfit.FCL,
                    _ => throw new NotImplementedException(),
                },
                _ => throw new NotImplementedException(),
            };

            if (isRequiredCustomClearance)
            {
                customClearance = clientProfit.CustomClearance;
            }
        }

        return new ClientChargeProfitsDto
        {
            IsRequiredCustomClearanceCharge = isRequiredCustomClearance,
            FreightProfitCharge = quoteFreightProfitCharge,
            CustomClearanceProfitCharge = customClearance,
            OriginProfitCharge = clientProfit.OriginCharges,
            DestinationProfitCharge = clientProfit.DestinationCharges,
        };
    }
}
