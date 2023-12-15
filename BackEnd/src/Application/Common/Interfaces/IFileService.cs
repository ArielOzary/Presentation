using Microsoft.AspNetCore.Http;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service working with files using Amazon S3
/// </summary>
public interface IFileService
{
    /// <summary>
    /// Method to receive file by it`s id
    /// </summary>
    /// <param name="fileId">Id of the file</param>
    /// <returns>Link on the file</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    Task<string> GetAsync(string fileId);

    /// <summary>
    /// Method to create file async
    /// </summary>
    /// <param name="file">File will be created</param>
    /// <returns>Key of the file</returns>
    /// <exception cref="AutoLogException">Exception thrown in case there were some errors during save</exception>
    Task<string> CreateAsync(IFormFile file);

    /// <summary>
    /// Method to create file async
    /// </summary>
    /// <param name="file">File will be created</param>
    /// <param name="contentType">Content Type</param>
    /// <returns>Key of the file</returns>
    /// <exception cref="AutoLogException">Exception thrown in case there were some errors during save</exception>
    Task<string> CreateAsync(IFormFile file, string contentType);

    /// <summary>
    /// Method to delete file 
    /// </summary>
    /// <param name="id">Id of the file to delete</param>
    /// <returns>Task</returns>
    Task DeleteAsync(string id);
}
