namespace AutoLog.Application.Common.Utils;

public static class FileExtensionUtils
{
    const string Pdf = "application/pdf";
    const string Adoc = "application/vnd.lt.archyvai.adoc-2008";
    const string Asic = "application/vnd.etsi.asic-e+zip";
    const string Doc = "application/msword";
    const string Docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const string Xls = "application/vnd.ms-excel";
    const string Xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const string Ppt = "application/vnd.ms-powerpoint";
    const string Pptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    const string Jpeg = "image/jpeg";
    const string Png = "image/png";
    const string Gif = "image/gif";
    const string Tiff = "image/tiff";
    const string Mp3 = "audio/mp3";
    const string VideoMp4 = "video/mp4";
    const string Webm = "video/webm";

    public static string GetMediaType(string? extension)
    {
        return extension switch
        {
            "adoc" => Adoc,
            "edoc" or "asice" => Asic,
            "doc" => Doc,
            "docx" => Docx,
            "jpeg" or "jpg" => Jpeg,
            "png" => Png,
            "tiff" or "tif" => Tiff,
            "gif" => Gif,
            "xls" => Xls,
            "xlsx" => Xlsx,
            "ppt" => Ppt,
            "pptx" => Pptx,
            "mp3" => Mp3,
            "mp4" => VideoMp4,
            "webm" => Webm,
            _ => Pdf,
        };
    }

    public static string? GetExtension(string filename)
    {
        return filename.Split('.').LastOrDefault();
    }
}
