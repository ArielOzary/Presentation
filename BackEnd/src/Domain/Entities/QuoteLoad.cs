namespace AutoLog.Domain.Entities;

public class QuoteLoad : BaseEntity
{
    public QuoteLoad()
    {

    }
    public QuoteLoad(ContainerType containerType, WeightFormat weightFormat, VolumeFormat volumeFormat, double? weight, double? volume, int? unitsQuantity)
    {
        ContainerType = containerType;
        WeightFormat = weightFormat;
        VolumeFormat = volumeFormat;
        Weight = weight.HasValue ? weight.Value : default;
        Volume = volume.HasValue ? volume.Value : default;
        UnitsQuantity = unitsQuantity.HasValue ? unitsQuantity.Value : default;
    }
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

    public CalculationOption CalculationOption { get; set; }

    public PackageType PackageType { get; set; }

    // public PackageType PackageType { get; set; } // TODO: Add later

    public int? QuoteId { get; set; }

    public Quote? Quote { get; set; }

    public int? RecentQuoteSearchId { get; set; }

    public RecentQuoteSearch? RecentQuoteSearch { get; set; }
}
