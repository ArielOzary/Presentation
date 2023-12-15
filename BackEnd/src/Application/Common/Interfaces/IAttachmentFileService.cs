using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Domain.Common;
using Microsoft.AspNetCore.Http;

namespace AutoLog.Application.Common.Interfaces;

/// <summary>
/// Service for work with files
/// </summary>
/// <typeparam name="TEntity">Generic argument which should be inherited from BaseAttachmentFile</typeparam>
/// <typeparam name="TId">Id of the entity</typeparam>
public interface IAttachmentFileService<TEntity, TId>
    where TEntity : BaseAttachmentFile, new()
    where TId : notnull
{
    /// <summary>
    /// Method to add files to entity
    /// </summary>
    /// <param name="entityId">Id of the entity to add files to</param>
    /// <param name="files">List of files to be added</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task AddFilesAsync(TId entityId, List<IFormFile> files, CancellationToken cancellationToken);

    /// <summary>
    /// Method to add file to entity
    /// </summary>
    /// <param name="entityId">Id of the entity to add file to</param>
    /// <param name="file">File to be added</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task AddFileAsync(TId entityId, IFormFile dto, CancellationToken cancellationToken);

    /// <summary>
    /// Method to get file
    /// </summary>
    /// <param name="id">Id of the file</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Found file</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    Task<FileDto> GetFileAsync(string id, CancellationToken cancellationToken);

    /// <summary>
    /// Method to remove file
    /// </summary>
    /// <param name="id">Id of the file</param>
    /// <returns>Task</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    Task RemoveFileAsync(string id);

    /// <summary>
    /// Method to remove file
    /// </summary>
    /// <param name="id">Id of the file</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    Task RemoveFileAsync(string id, CancellationToken cancellationToken);
}
