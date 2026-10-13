using VietAILife.Domain.Enums;

namespace VietAILife.Application.Common.Interfaces;

public record ChatMessagePrompt(string Role, string Content);

public record ChatRequest(
    IEnumerable<ChatMessagePrompt> Messages,
    string? SystemPrompt = null,
    double Temperature = 0.7,
    int MaxTokens = 2048,
    string? Model = null
);

public record ChatResponse(
    string Content,
    string? ThoughtProcess,
    TrustLevel TrustLevel,
    int PromptTokens,
    int CompletionTokens,
    string ModelUsed
);

public record ChatStreamChunk(
    string Delta,
    bool IsDone = false,
    string? ThoughtDelta = null,
    TrustLevel TrustLevel = TrustLevel.Unspecified
);

public record VisionRequest(
    Stream ImageStream,
    string MimeType,
    string Prompt = "Phân tích và mô tả chi tiết hình ảnh này bằng tiếng Việt."
);

public record VisionAnalysisResult(
    string Description,
    string? ExtractedTextOcr,
    IReadOnlyList<string>? DetectedObjects,
    string? AgriculturalDiagnosis
);

public interface IAIProvider
{
    string ProviderName { get; }
    
    // 1. Chat & Reasoning with Realtime Streaming
    IAsyncEnumerable<ChatStreamChunk> StreamChatAsync(ChatRequest request, CancellationToken ct = default);
    Task<ChatResponse> GenerateChatAsync(ChatRequest request, CancellationToken ct = default);

    // 2. Vector Embeddings
    Task<float[]> GenerateEmbeddingAsync(string text, CancellationToken ct = default);
    Task<IReadOnlyList<float[]>> GenerateEmbeddingsBatchAsync(IEnumerable<string> texts, CancellationToken ct = default);

    // 3. Vision & OCR
    Task<VisionAnalysisResult> AnalyzeImageAsync(VisionRequest request, CancellationToken ct = default);

    // 4. Voice Transcription & Synthesis
    Task<string> TranscribeAudioAsync(Stream audioStream, string language = "vi", CancellationToken ct = default);
    Task<Stream> SynthesizeSpeechAsync(string text, string voiceTone = "North", CancellationToken ct = default);
}

public interface ITokenService
{
    string GenerateAccessToken(Guid userId, string email, IEnumerable<string> roles, IEnumerable<string> permissions);
    string GenerateRefreshToken();
    bool ValidateToken(string token, out Guid userId);
}

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
}

public record VectorSearchResult(
    Guid ChunkId,
    Guid DocumentId,
    string DocumentTitle,
    string Content,
    int? PageNumber,
    float Score,
    string? SourceUrl,
    string? Organization,
    TrustLevel TrustLevel
);

public interface IVectorStore
{
    Task UpsertVectorAsync(Guid chunkId, Guid documentId, float[] vector, string content, string metadataJson, CancellationToken ct = default);
    Task<IReadOnlyList<VectorSearchResult>> SearchSimilarAsync(float[] queryVector, int topK = 5, float minScore = 0.5f, CancellationToken ct = default);
    Task DeleteDocumentVectorsAsync(Guid documentId, CancellationToken ct = default);
}

public interface IStorageService
{
    Task<string> UploadFileAsync(Stream stream, string originalFileName, string mimeType, CancellationToken ct = default);
    Task<Stream> DownloadFileAsync(string storagePath, CancellationToken ct = default);
    Task DeleteFileAsync(string storagePath, CancellationToken ct = default);
}
