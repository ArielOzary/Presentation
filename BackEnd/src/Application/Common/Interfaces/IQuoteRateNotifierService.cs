namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service which notifies users about new quotes and deactivates rates
/// </summary>
public interface IQuoteRateNotifierService
{
    /// <summary>
    /// Method to check if there are new rates to quotes
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task CheckQuotesAsync(CancellationToken cancellationToken);


    Task CheckQuotesAsync(int freightForwardCompanyId, CancellationToken cancellationToken);

    /// <summary>
    /// Method to deactivate rates
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task DeactivateRatesAsync(CancellationToken cancellationToken);
}
