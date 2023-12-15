using System.Xml.Serialization;

namespace AutoLog.Application.Common.Dtos.CurrencyExchangeRate;

/// <summary>
/// European Central Bank
/// </summary>
[XmlRoot(ElementName = "Envelope", Namespace = "http://www.gesmes.org/xml/2002-08-01")]
public class ECBExchangeRateResponseDto
{
    //[XmlElement(ElementName = "subject", Namespace = "http://www.gesmes.org/xml/2002-08-01")]
    //public string Subject { get; set; }
    //[XmlElement(ElementName = "Sender", Namespace = "http://www.gesmes.org/xml/2002-08-01")]
    //public Sender Sender { get; set; }
    [XmlElement(ElementName = "Cube", Namespace = "http://www.ecb.int/vocabulary/2002-08-01/eurofxref")]
    public Cube RootCube { get; set; } = null!;
    //[XmlAttribute(AttributeName = "gesmes", Namespace = "http://www.w3.org/2000/xmlns/")]
    //public string Gesmes { get; set; }
    //[XmlAttribute(AttributeName = "xmlns")]
    //public string Xmlns { get; set; }
}

//[XmlRoot(ElementName = "Sender", Namespace = "http://www.gesmes.org/xml/2002-08-01")]
//public class Sender
//{
//    [XmlElement(ElementName = "name", Namespace = "http://www.gesmes.org/xml/2002-08-01")]
//    public string Name { get; set; }
//}

[XmlRoot(ElementName = "Cube", Namespace = "http://www.ecb.int/vocabulary/2002-08-01/eurofxref")]
public class Cube
{

    [XmlAttribute(AttributeName = "currency", Namespace = "")]
    public string Currency { get; set; } = string.Empty;

    [XmlAttribute(AttributeName = "rate", Namespace = "")]
    public double Rate { get; set; }

    [XmlElement(ElementName = "Cube", Namespace = "http://www.ecb.int/vocabulary/2002-08-01/eurofxref")]
    public List<Cube> Cubes { get; set; } = new();

    [XmlAttribute(AttributeName = "time", Namespace = "")]
    public DateTime Time { get; set; }
}
