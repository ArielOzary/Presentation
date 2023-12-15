using System.Xml.Serialization;
using AutoLog.Application.Common.Dtos.CurrencyExchangeRate;
using AutoLog.Application.Common.Interfaces.HttpClients;
using Microsoft.Extensions.Logging;

namespace AutoLog.Infrastructure.ExternalClients.EuroExchangeRatesClient;

/// <summary>
/// Http client to work with european central bank currencies
/// </summary>
public class ECBEuroExchangeRatesHttpClient : IECBEuroExchangeRatesHttpClient
{
    protected readonly ILogger<ECBEuroExchangeRatesHttpClient> _logger;
    protected readonly HttpClient _httpClient;

    public ECBEuroExchangeRatesHttpClient(
        ILogger<ECBEuroExchangeRatesHttpClient> logger)
    {
        _logger = logger;
        _httpClient = new HttpClient();
    }

    /// <summary>
    /// Method to get currency rates
    /// </summary>
    /// <returns>Currency rates</returns>
    public async Task<ECBExchangeRateResponseDto> GetEuroExchangeRatesAsync()
    {
        var url = GetUrl("/stats/eurofxref/eurofxref-daily.xml");

        var response = await GetAsync<ECBExchangeRateResponseDto>(url, "GetEuroExchangeRate");

        return response;
    }

    /// <summary>
    /// Get response from api
    /// </summary>
    /// <typeparam name="T">Generic class of response</typeparam>
    /// <param name="url">API url</param>
    /// <param name="actionTitle">Action</param>
    /// <returns>Response from API</returns>
    /// <exception cref="Exception">Exception thrown if operation was not successful</exception>
    private async Task<T> GetAsync<T>(string url, string actionTitle)
    {
        _logger.LogInformation($"Sending to {url} action with title: {actionTitle}.");
        var response = await _httpClient.GetAsync(url);
        _logger.LogInformation($"Got response: {response.StatusCode}");

        if (!response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync();

            throw new Exception($"Error during sending {actionTitle}: {response.ReasonPhrase}. Body: {responseBody}");
        }

        return ConvertXmlStringtoObject<T>(await response.Content.ReadAsStringAsync());
    }

    /// <summary>
    /// Method to convert xml string to object
    /// </summary>
    /// <typeparam name="T">Generic class of response</typeparam>
    /// <param name="xmlString">Xml string</param>
    /// <returns>Converted xml to object</returns>
    static T ConvertXmlStringtoObject<T>(string xmlString)
    {
        var xmlSerializer = new XmlSerializer(typeof(T));
        using var stringReader = new StringReader(xmlString);
        T classObject = (T)xmlSerializer.Deserialize(stringReader)!;

        return classObject;
    }

    private static string GetUrl(string url)
    {
        return $"https://www.ecb.europa.eu{url}";
    }
}
