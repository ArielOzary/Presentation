namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service reminding freight forwarders about shipment status steps
/// </summary>
public interface IReminderService
{
    /// <summary>
    /// Method which remings freight forwarder
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task RemindAsync(CancellationToken cancellationToken);
}
