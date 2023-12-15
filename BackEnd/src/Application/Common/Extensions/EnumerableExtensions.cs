namespace AutoLog.Application.Common.Extensions;

public static class EnumerableExtensions
{
    public static IEnumerable<T> OrderByCondition<T>(this IEnumerable<T> source, Func<T, object> expression, bool descending = false)
    {
        return !descending ? source.OrderBy(expression) : source.OrderByDescending(expression);
    }

    public static IEnumerable<T> WhereIf<T>(
    this IEnumerable<T> queryable,
    bool condition,
    Func<T, bool> predicate)
    {
        return condition ? queryable.Where(predicate) : queryable;
    }
}
