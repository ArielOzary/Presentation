using AutoLog.Domain.Entities;
using CsvHelper.Configuration;

namespace AutoLog.Infrastructure.Files.Maps;

public class AirPortMap : ClassMap<Port>
{
    public AirPortMap()
    {
        Map(p => p.Country).Index(0);
        Map(p => p.Name).Index(1);
        Map(p => p.Province).Index(2);
        Map(p => p.Id).Index(3);
        Map(p => p.PortType).Constant(Domain.Enums.PortType.Air);
    }
}
