using Microsoft.Extensions.Caching.Memory;

namespace AutoLog.Application.Common.Extensions;

public static class MemoryCacheExtensions
{
    private static readonly SemaphoreSlim SemLock = new(1);

    public static async Task<TItem> GetOrCreateExclusiveAsync<TItem>(this IMemoryCache cache, object key, Func<ICacheEntry, Task<TItem>> factory)
    {
        if (!cache.TryGetValue(key, out object? result))
        {
            await SemLock.WaitAsync();

            try
            {
                if (cache.TryGetValue(key, out result))
                {
                    return (TItem)result!;
                }

                var entry = cache.CreateEntry(key);
                result = await factory(entry).ConfigureAwait(false);
                entry.SetValue(result!);
                entry.Dispose();
            }
            finally
            {
                SemLock.Release();
            }
        }

        return (TItem)result!;
    }
}