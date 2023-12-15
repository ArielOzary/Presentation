using System.Net;
using Amazon.S3;
using Amazon.S3.Model;
using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Infrastructure.Configurations;
using Microsoft.AspNetCore.Http;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service working with files using Amazon S3
/// </summary>
public class FileService : IFileService
{
    private readonly string _defaultBucket;

    private readonly IAmazonS3 _s3Client;
    private readonly AwsS3Config _awsS3Config;

    public FileService(IAmazonS3 amazonS3Client, AwsS3Config awsS3Config)
    {
        _s3Client = amazonS3Client;
        _awsS3Config = awsS3Config;
        _defaultBucket = _awsS3Config.BucketName;
    }

    /// <summary>
    /// Method to create file async
    /// </summary>
    /// <param name="file">File will be created</param>
    /// <returns>Key of the file</returns>
    /// <exception cref="AutoLogException">Exception thrown in case there were some errors during save</exception>
    public async Task<string> CreateAsync(IFormFile file)
    {
        await CreateBucketIfNotExistsAsync();

        var putObjectRequest = new PutObjectRequest
        {
            BucketName = _defaultBucket,
            Key = Guid.NewGuid().ToString(),
            InputStream = file.OpenReadStream(),
            ContentType = file.ContentType
        };

        var result = await _s3Client.PutObjectAsync(putObjectRequest);

        if (result.HttpStatusCode != HttpStatusCode.OK)
            throw new AutoLogException(ErrorCodes.AMAZON_S3_ERROR);

        return putObjectRequest.Key;
    }

    /// <summary>
    /// Method to create file async
    /// </summary>
    /// <param name="file">File will be created</param>
    /// <param name="contentType">Content Type</param>
    /// <returns>Key of the file</returns>
    /// <exception cref="AutoLogException">Exception thrown in case there were some errors during save</exception>
    public async Task<string> CreateAsync(IFormFile file, string contentType)
    {
        await CreateBucketIfNotExistsAsync();

        var putObjectRequest = new PutObjectRequest
        {
            BucketName = _defaultBucket,
            Key = file.FileName,
            InputStream = file.OpenReadStream(),
            ContentType = contentType
        };

        var result = await _s3Client.PutObjectAsync(putObjectRequest);

        if (result.HttpStatusCode != HttpStatusCode.OK)
            throw new AutoLogException(ErrorCodes.AMAZON_S3_ERROR);

        return putObjectRequest.Key;
    }

    /// <summary>
    /// Method to delete file 
    /// </summary>
    /// <param name="id">Id of the file to delete</param>
    /// <returns>Task</returns>
    public async Task DeleteAsync(string id)
    {
        await _s3Client.DeleteObjectAsync(_defaultBucket, id);
    }

    /// <summary>
    /// Method to receive file by it`s id
    /// </summary>
    /// <param name="fileId">Id of the file</param>
    /// <returns>Link on the file</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    public async Task<string> GetAsync(string fileId)
    {
        var s3ObjectResponse = await _s3Client.GetObjectAsync(_defaultBucket, fileId);

        var request = new GetPreSignedUrlRequest()
        {
            BucketName = s3ObjectResponse.BucketName,
            Key = fileId,
            Expires = DateTime.UtcNow.AddMinutes(15),
        };

        var url = _s3Client.GetPreSignedURL(request);

        if (string.IsNullOrEmpty(url))
            throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        return url;
    }

    /// <summary>
    /// Method to ensure amazon bucket exists
    /// </summary>
    /// <returns>Task</returns>
    /// <exception cref="AutoLogException">Exception thrown if bucket does not exist</exception>
    private async Task CreateBucketIfNotExistsAsync()
    {
        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, _defaultBucket);

        if (!bucketExists)
            throw new AutoLogException("Amazon S3 does not exist");
    }
}
