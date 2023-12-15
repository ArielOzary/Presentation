using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Dtos.Quotes.QuoteLoads;

public class QuoteLoadCreateDto
{
    public int UnitsQuantity { get; set; }

    public WeightFormat WeightFormat { get; set; }

    public double Weight { get; set; }

    public double WeightPerUnit { get; set; }

    public VolumeFormat VolumeFormat { get; set; }

    public double Volume { get; set; }

    public DimensionsFormat DimensionsFormat { get; set; }

    public double Length { get; set; }

    public double Width { get; set; }

    public double Height { get; set; }

    public ContainerType ContainerType { get; set; }

    public PackageType PackageType { get; set; }

    public CalculationOption CalculationOption { get; set; }
}
