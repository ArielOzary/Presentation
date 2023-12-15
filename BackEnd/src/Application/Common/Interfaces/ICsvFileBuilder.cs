using AutoLog.Application.Ports;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Common.Interfaces;

public interface ICsvFileBuilder
{
    List<IndustryType> ReadBaseIndustryTypes();

    List<Port> ReadBaseAirPorts();

    List<Port> ReadBaseOceanPorts();

    List<Port> ReadNewPorts();

    byte[] WriteToFile<T>(List<T> records) where T : class;
}
