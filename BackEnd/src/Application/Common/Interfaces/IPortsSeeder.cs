namespace AutoLog.Application.Common.Interfaces;

public interface IPortsSeeder
{
    /// <summary>
    /// Method which seeds ports on startup and in cron job
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task SeedAsync(CancellationToken cancellationToken);
}
