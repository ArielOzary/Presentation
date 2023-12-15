namespace AutoLog.Application.Common.Dtos.Filtering;

public class SelectFilterDto<T>
{
    public T Value { get; set; } = default!;
}
