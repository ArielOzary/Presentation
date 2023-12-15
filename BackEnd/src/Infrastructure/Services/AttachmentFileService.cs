using AutoLog.Application.Common.Constants;
using AutoLog.Application.Common.Dtos.AttachmentFiles;
using AutoLog.Application.Common.Exceptions.ApplicationExceptions;
using AutoLog.Application.Common.Interfaces;
using AutoLog.Application.Common.Utils;
using AutoLog.Domain.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Services;

/// <summary>
/// Service for work with files
/// </summary>
/// <typeparam name="TEntity">Generic argument which should be inherited from BaseAttachmentFile</typeparam>
/// <typeparam name="TId">Id of the entity</typeparam>
public sealed class AttachmentFileService<TEntity, TId> : IAttachmentFileService<TEntity, TId>
    where TEntity : BaseAttachmentFile, new()
    where TId : notnull
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public AttachmentFileService(IApplicationDbContext context,
        IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    /// <summary>
    /// Method to add file to entity
    /// </summary>
    /// <param name="entityId">Id of the entity to add file to</param>
    /// <param name="file">File to be added</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task AddFileAsync(TId entityId, IFormFile file, CancellationToken cancellationToken)
    {
        var id = await _fileService.CreateAsync(file);

        var newAttachment = (TEntity)Activator.CreateInstance(typeof(TEntity), new object[]
        {
            Path.GetExtension(file.FileName)[1..].ToLower(),
            id,
            file.FileName,
            entityId
        })!;

        await _context.Set<TEntity>().AddAsync(newAttachment, cancellationToken);
    }

    /// <summary>
    /// Method to add files to entity
    /// </summary>
    /// <param name="entityId">Id of the entity to add files to</param>
    /// <param name="files">List of files to be added</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    public async Task AddFilesAsync(TId entityId, List<IFormFile> files, CancellationToken cancellationToken)
    {
        var attachments = new List<TEntity>();

        foreach (var file in files)
        {
            var id = await _fileService.CreateAsync(file);

            var newAttachment = (TEntity)Activator.CreateInstance(typeof(TEntity), new object[]
            {
                Path.GetExtension(file.FileName)[1..].ToLower(),
                id,
                file.FileName,
                entityId
            })!;

            attachments.Add(newAttachment);
        }

        await _context.Set<TEntity>().AddRangeAsync(attachments, cancellationToken);
        await _context.SaveChangesAsync(CancellationToken.None);
        //ToDo Delete file from bucket if exception or cronjob
    }

    /// <summary>
    /// Method to get file
    /// </summary>
    /// <param name="id">Id of the file</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Found file</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    public async Task<FileDto> GetFileAsync(string id, CancellationToken cancellationToken)
    {
        var attachement = await _context.Set<TEntity>()
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        return new FileDto
        {
            Link = await _fileService.GetAsync(attachement.FileId),
            Name = attachement.Name,
            Extension = attachement.Extension,
            MediaType = FileExtensionUtils.GetMediaType(attachement.Extension)
        };
    }

    /// <summary>
    /// Method to remove file
    /// </summary>
    /// <param name="id">Id of the file</param>
    /// <returns>Task</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    public async Task RemoveFileAsync(string id)
    {
        var attachement = await _context.Set<TEntity>()
            .FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        await _fileService.DeleteAsync(attachement.FileId);
        _context.Set<TEntity>().Remove(attachement);

        await _context.SaveChangesAsync(CancellationToken.None);
    }

    /// <summary>
    /// Method to remove file
    /// </summary>
    /// <param name="id">Id of the file</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    /// <exception cref="AutoLogException">Exception thrown if file was not found</exception>
    public async Task RemoveFileAsync(string id, CancellationToken cancellationToken)
    {
        var attachement = await _context.Set<TEntity>()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new AutoLogException(ErrorCodes.FILE_NOT_FOUND);

        await _fileService.DeleteAsync(attachement.FileId);
        _context.Set<TEntity>().Remove(attachement);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
