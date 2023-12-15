﻿using System.Text;

namespace AutoLog.Infrastructure.Common;

/// <summary>
/// Utility extensions to streams
/// </summary>
public static class StreamExtensions
{
    internal static readonly Encoding DefaultEncoding = new UTF8Encoding(false, true);

    public static BinaryReader CreateReader(this Stream stream)
    {
        return new BinaryReader(stream, DefaultEncoding, true);
    }

    public static BinaryWriter CreateWriter(this Stream stream)
    {
        return new BinaryWriter(stream, DefaultEncoding, true);
    }

    public static DateTimeOffset ReadDateTimeOffset(this BinaryReader reader)
    {
        return new DateTimeOffset(reader.ReadInt64(), TimeSpan.Zero);
    }

    public static void Write(this BinaryWriter writer, DateTimeOffset value)
    {
        writer.Write(value.UtcTicks);
    }
}