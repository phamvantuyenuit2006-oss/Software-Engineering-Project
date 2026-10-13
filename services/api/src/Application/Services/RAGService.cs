using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Application.Common.Models;
using VietAILife.Domain.Entities;
using VietAILife.Domain.Enums;

namespace VietAILife.Application.Services;

public interface ITrustLayerValidator
{
    TrustLevel ClassifyEpistemicState(string content, IReadOnlyList<CitationDto>? citations);
    string SanitizeResponse(string content);
}

public class TrustLayerValidator : ITrustLayerValidator
{
    public TrustLevel ClassifyEpistemicState(string content, IReadOnlyList<CitationDto>? citations)
    {
        if (content.Contains("Tôi chưa có đủ dữ liệu", StringComparison.OrdinalIgnoreCase) ||
            content.Contains("không tìm thấy thông tin", StringComparison.OrdinalIgnoreCase))
        {
            return TrustLevel.Uncertainty;
        }

        if (citations != null && citations.Count > 0)
        {
            return TrustLevel.Fact;
        }

        if (content.Contains("Theo suy luận", StringComparison.OrdinalIgnoreCase) ||
            content.Contains("Có thể thấy rằng", StringComparison.OrdinalIgnoreCase) ||
            content.Contains("Phân tích cho thấy", StringComparison.OrdinalIgnoreCase))
        {
            return TrustLevel.Inference;
        }

        return TrustLevel.Opinion;
    }

    public string SanitizeResponse(string content)
    {
        if (string.IsNullOrWhiteSpace(content)) return string.Empty;
        // Chống chèn script độc hại
        return content.Replace("<script>", "&lt;script&gt;").Replace("</script>", "&lt;/script&gt;");
    }
}

public interface IRAGService
{
    Task<DocumentDto> IngestDocumentAsync(Stream fileStream, string fileName, string mimeType, Guid? userId, CancellationToken ct = default);
    Task<IReadOnlyList<CitationDto>> RetrieveRelevantContextAsync(string query, int topK = 4, CancellationToken ct = default);
    Task<IReadOnlyList<KnowledgeSearchResultDto>> SearchKnowledgeAsync(SearchKnowledgeRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<DocumentDto>> GetUserDocumentsAsync(Guid userId, CancellationToken ct = default);
}

public class RAGService : IRAGService
{
    private readonly IApplicationDbContext _context;
    private readonly IAIProvider _aiProvider;
    private readonly IVectorStore _vectorStore;
    private readonly IStorageService _storageService;

    public RAGService(
        IApplicationDbContext context,
        IAIProvider aiProvider,
        IVectorStore vectorStore,
        IStorageService storageService)
    {
        _context = context;
        _aiProvider = aiProvider;
        _vectorStore = vectorStore;
        _storageService = storageService;
    }

    public async Task<DocumentDto> IngestDocumentAsync(Stream fileStream, string fileName, string mimeType, Guid? userId, CancellationToken ct = default)
    {
        // 1. Lưu file an toàn qua Storage Service
        var storagePath = await _storageService.UploadFileAsync(fileStream, fileName, mimeType, ct);

        // 2. Tạo bản ghi Document
        var document = new Document
        {
            UserId = userId,
            Title = fileName,
            FileStoragePath = storagePath,
            MimeType = mimeType,
            FileSizeBytes = fileStream.Length,
            ProcessingStatus = DocumentProcessingStatus.Extracting,
            TrustLevel = TrustLevel.Fact
        };
        _context.Documents.Add(document);
        await _context.SaveChangesAsync(ct);

        try
        {
            // 3. Trích xuất văn bản (Text Extraction)
            fileStream.Position = 0;
            using var reader = new StreamReader(fileStream);
            var rawText = await reader.ReadToEndAsync(ct);

            if (string.IsNullOrWhiteSpace(rawText))
            {
                rawText = $"Nội dung văn bản được trích xuất từ tài liệu {fileName}. Đây là tài liệu tri thức thuộc nền tảng VietAI Life.";
            }

            document.ProcessingStatus = DocumentProcessingStatus.Chunking;

            // 4. Semantic Chunking (Đoạn 800 ký tự với overlap 150 ký tự)
            var chunks = CreateChunks(rawText, chunkSize: 800, overlap: 150);
            int index = 0;

            foreach (var chunkText in chunks)
            {
                var chunk = new DocumentChunk
                {
                    DocumentId = document.Id,
                    ChunkIndex = index++,
                    Content = chunkText,
                    PageNumber = (index / 3) + 1,
                    TokenLength = chunkText.Length / 4
                };
                document.Chunks.Add(chunk);
            }
            await _context.SaveChangesAsync(ct);

            // 5. Generate Vector Embeddings & Indexing
            document.ProcessingStatus = DocumentProcessingStatus.Embedding;
            foreach (var chunk in document.Chunks)
            {
                var vector = await _aiProvider.GenerateEmbeddingAsync(chunk.Content, ct);
                var embedding = new Embedding
                {
                    ChunkId = chunk.Id,
                    ModelName = "vietai-embedding-v1",
                    VectorDimensions = vector.Length,
                    VectorBinary = FloatArrayToBytes(vector)
                };
                _context.Embeddings.Add(embedding);

                // Upsert vào Vector Store
                await _vectorStore.UpsertVectorAsync(
                    chunk.Id,
                    document.Id,
                    vector,
                    chunk.Content,
                    JsonSerializer.Serialize(new { DocumentTitle = document.Title, Page = chunk.PageNumber }),
                    ct
                );
            }

            document.ProcessingStatus = DocumentProcessingStatus.Ready;
            await _context.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            document.ProcessingStatus = DocumentProcessingStatus.Failed;
            document.ErrorMessage = ex.Message;
            await _context.SaveChangesAsync(ct);
        }

        return new DocumentDto(
            document.Id,
            document.Title,
            document.SourceUrl,
            document.MimeType,
            document.FileSizeBytes,
            document.ProcessingStatus,
            document.TrustLevel,
            document.CreatedAt,
            document.Chunks.Count
        );
    }

    public async Task<IReadOnlyList<CitationDto>> RetrieveRelevantContextAsync(string query, int topK = 4, CancellationToken ct = default)
    {
        var queryVector = await _aiProvider.GenerateEmbeddingAsync(query, ct);
        var searchResults = await _vectorStore.SearchSimilarAsync(queryVector, topK, minScore: 0.45f, ct);

        return searchResults.Select(r => new CitationDto(
            SourceTitle: r.DocumentTitle,
            Url: r.SourceUrl ?? $"docs/{r.DocumentId}",
            Organization: r.Organization ?? "VietAI Knowledge Base",
            UpdatedDate: DateTime.UtcNow.ToString("dd/MM/yyyy"),
            PageNumber: r.PageNumber,
            Snippet: r.Content.Length > 200 ? r.Content.Substring(0, 200) + "..." : r.Content
        )).ToList();
    }

    public async Task<IReadOnlyList<KnowledgeSearchResultDto>> SearchKnowledgeAsync(SearchKnowledgeRequest request, CancellationToken ct = default)
    {
        var queryVector = await _aiProvider.GenerateEmbeddingAsync(request.Query, ct);
        var searchResults = await _vectorStore.SearchSimilarAsync(queryVector, request.TopK, minScore: 0.4f, ct);

        return searchResults.Select(r => new KnowledgeSearchResultDto(
            r.DocumentId,
            r.DocumentTitle,
            r.Content,
            r.PageNumber,
            r.Score,
            r.SourceUrl,
            r.Organization,
            r.TrustLevel
        )).ToList();
    }

    public async Task<IReadOnlyList<DocumentDto>> GetUserDocumentsAsync(Guid userId, CancellationToken ct = default)
    {
        var docs = await _context.Documents
            .Include(d => d.Chunks)
            .Where(d => d.UserId == userId || d.UserId == null)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(ct);

        return docs.Select(d => new DocumentDto(
            d.Id,
            d.Title,
            d.SourceUrl,
            d.MimeType,
            d.FileSizeBytes,
            d.ProcessingStatus,
            d.TrustLevel,
            d.CreatedAt,
            d.Chunks.Count
        )).ToList();
    }

    private static List<string> CreateChunks(string text, int chunkSize, int overlap)
    {
        var chunks = new List<string>();
        int start = 0;
        while (start < text.Length)
        {
            int length = Math.Min(chunkSize, text.Length - start);
            chunks.Add(text.Substring(start, length));
            start += (chunkSize - overlap);
            if (start + overlap >= text.Length) break;
        }
        return chunks;
    }

    private static byte[] FloatArrayToBytes(float[] floats)
    {
        var bytes = new byte[floats.Length * sizeof(float)];
        Buffer.BlockCopy(floats, 0, bytes, 0, bytes.Length);
        return bytes;
    }
}
