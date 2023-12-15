namespace AutoLog.Application.Common.Extensions;

public static class StringExtensions
{
    public static int? ToNullableInt(this string input)
    {
        return int.TryParse(input, out int value) ? value : null;
    }
}
