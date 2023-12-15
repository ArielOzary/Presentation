using System.Globalization;
using System.Text;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Ports;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Files.Maps;
using CsvHelper;
using CsvHelper.Configuration;

namespace AutoLog.Infrastructure.Files;

public class CsvFileBuilder : ICsvFileBuilder
{
    private static readonly string Folder = AppContext.BaseDirectory;

    public List<IndustryType> ReadBaseIndustryTypes()
    {
        var filePath = Path.Combine(Folder, "Resources", "fileIndustryTypes.csv");
        var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = false,
            Delimiter = ";",
        };

        var records = new List<IndustryType>();

        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, configuration))
        {
            csv.Context.RegisterClassMap<IndustryTypeMap>();
            records = csv.GetRecordsAsync<IndustryType>().ToBlockingEnumerable().ToList();
        }

        return records;
    }

    public List<Port> ReadBaseAirPorts()
    {
        var filePath = Path.Combine(Folder, "Resources", "airPorts.csv");
        var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            Delimiter = ";",
        };

        var records = new List<Port>();

        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, configuration))
        {
            csv.Context.RegisterClassMap<AirPortMap>();
            records = csv.GetRecordsAsync<Port>().ToBlockingEnumerable().ToList();
        }

        return records;
    }

    public List<Port> ReadBaseOceanPorts()
    {
        var filePath = Path.Combine(Folder, "Resources", "oceanPorts.csv");
        var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            Delimiter = ";",
        };

        var records = new List<Port>();

        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, configuration))
        {
            csv.Context.RegisterClassMap<OceanPortMap>();
            records = csv.GetRecordsAsync<Port>().ToBlockingEnumerable().ToList();
        }

        return records;
    }

    public List<Port> ReadNewPorts()
    {
        var filePath = Path.Combine(Folder, "Resources", "Autolog Ocean Ports - Sheet1.csv");
        var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            Delimiter = ",",
        };

        var records = new List<Port>();

        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, configuration))
        {
            csv.Context.RegisterClassMap<NewOceanPortMap>();
            records = csv.GetRecordsAsync<Port>().ToBlockingEnumerable().ToList();
        }

        return records;
    }

    public byte[] WriteToFile<T>(List<T> records) where T : class
    {
        var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            Delimiter = ";",
        };

        using var stream = new MemoryStream();
        using (var writer = new StreamWriter(stream, Encoding.UTF8))
        using (var csv = new CsvWriter(writer, configuration))
        {
            csv.WriteRecords(records);
        }

        return stream.ToArray();
    }
}
