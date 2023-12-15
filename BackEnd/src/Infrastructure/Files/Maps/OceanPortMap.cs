using AutoLog.Domain.Entities;
using CsvHelper.Configuration;

namespace AutoLog.Infrastructure.Files.Maps;

public class OceanPortMap : ClassMap<Port>
{
    public OceanPortMap()
    {
        Map(p => p.Country).Index(0);
        Map(p => p.Name).Index(1);
        Map(p => p.Province).Index(2);
        Map(p => p.Id).Index(3);
        Map(p => p.PortType).Constant(Domain.Enums.PortType.Ocean);
    }
}

public class NewOceanPortMap : ClassMap<Port>
{
    public NewOceanPortMap()
    {
        Map(p => p.Name).Index(0);
        Map(p => p.Country).Index(1);
        Map(p => p.Latitude).Index(2);
        Map(p => p.Longitude).Index(3);

        Map(p => p.Province).Constant(string.Empty);
        Map(p => p.Id).Constant(default);
        Map(p => p.PortType).Constant(Domain.Enums.PortType.Ocean);
    }
}
