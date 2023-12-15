using AutoLog.Domain.Entities;
using CsvHelper.Configuration;

namespace AutoLog.Infrastructure.Files.Maps;

public class IndustryTypeMap : ClassMap<IndustryType>
{
    public IndustryTypeMap()
    {
        Map(p => p.Name).Index(0);
    }
}