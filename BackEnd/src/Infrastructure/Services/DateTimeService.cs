using AutoLog.Application.Common.Interfaces;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service to get current time
/// </summary>
public sealed class DateTimeService : IDateTime
{
    public DateTime UtcNow => DateTime.UtcNow;
}
