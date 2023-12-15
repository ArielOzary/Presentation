using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.EmailParserDtos;

public class EmailParserGoodsDataDto
{
    public string PoNumber { get; set; } = string.Empty;

    public double? TotalWeight { get; set; }

    public double? TotalVolume { get; set; }

    public int? NumberOfPackages { get; set; }

    public ContainerType ContainerType { get; set; }

    public WeightFormat WeightFormat { get; set; }

    public VolumeFormat VolumeFormat { get; set; }
}
