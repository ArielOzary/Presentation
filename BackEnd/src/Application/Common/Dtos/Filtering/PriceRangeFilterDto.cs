﻿namespace AutoLog.Application.Common.Dtos.Filtering;

public class PriceRangeFilterDto<T> where T : struct
{
    public T? From { get; set; }

    public T? To { get; set; }
}
