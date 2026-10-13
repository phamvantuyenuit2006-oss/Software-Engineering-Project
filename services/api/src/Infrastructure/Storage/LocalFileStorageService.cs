using VietAILife.Application.Common.Interfaces;

namespace VietAILife.Infrastructure.Storage;

public class LocalFileStorageService : IStorageService
{
    private readonly string _baseUploadPath;

    public LocalFileStorageService()
    {
        _baseUploadPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "storage", "uploads");
        if (!Directory.Exists(_baseUploadPath))
        {
            Directory.CreateDirectory(_baseUploadPath);
        }
    }

    public async Task<string> UploadFileAsync(Stream stream, string originalFileName, string mimeType, CancellationToken ct = default)
    {
        var extension = Path.GetExtension(originalFileName);
        var safeFileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(_baseUploadPath, safeFileName);

        using var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
        stream.Position = 0;
        await stream.CopyToAsync(fileStream, ct);

        return fullPath;
    }

    public Task<Stream> DownloadFileAsync(string storagePath, CancellationToken ct = default)
    {
        if (!File.Exists(storagePath)) throw new FileNotFoundException("Không tìm thấy file lưu trữ.");
        var stream = new FileStream(storagePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult<Stream>(stream);
    }

    public Task DeleteFileAsync(string storagePath, CancellationToken ct = default)
    {
        if (File.Exists(storagePath)) File.Delete(storagePath);
        return Task.CompletedTask;
    }
}
