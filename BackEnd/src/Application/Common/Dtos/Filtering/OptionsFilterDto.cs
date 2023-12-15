namespace AutoLog.Application.Common.Dtos.Filtering;

public class OptionsFilterDto<T>
{
    public List<T> Options { get; set; } = new List<T>();
}
