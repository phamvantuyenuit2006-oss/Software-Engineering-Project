using System.Collections.Concurrent;
using System.Text.Json;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Domain.Enums;

namespace VietAILife.Infrastructure.VectorDb;

public class InMemoryVectorStore : IVectorStore
{
    private record StoredVector(Guid ChunkId, Guid DocumentId, float[] Vector, string Content, string MetadataJson);
    private readonly ConcurrentDictionary<Guid, StoredVector> _store = new();

    public Task UpsertVectorAsync(Guid chunkId, Guid documentId, float[] vector, string content, string metadataJson, CancellationToken ct = default)
    {
        _store[chunkId] = new StoredVector(chunkId, documentId, vector, content, metadataJson);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<VectorSearchResult>> SearchSimilarAsync(float[] queryVector, int topK = 5, float minScore = 0.5f, CancellationToken ct = default)
    {
        var results = new List<VectorSearchResult>();

        foreach (var item in _store.Values)
        {
            var similarity = ComputeCosineSimilarity(queryVector, item.Vector);
            if (similarity >= minScore)
            {
                string title = "Tài liệu Tri thức VietAI";
                int? page = 1;

                try
                {
                    using var doc = JsonDocument.Parse(item.MetadataJson);
                    if (doc.RootElement.TryGetProperty("DocumentTitle", out var tProp)) title = tProp.GetString() ?? title;
                    if (doc.RootElement.TryGetProperty("Page", out var pProp)) page = pProp.GetInt32();
                }
                catch { }

                results.Add(new VectorSearchResult(
                    ChunkId: item.ChunkId,
                    DocumentId: item.DocumentId,
                    DocumentTitle: title,
                    Content: item.Content,
                    PageNumber: page,
                    Score: similarity,
                    SourceUrl: "https://vietailife.vn/docs/" + item.DocumentId,
                    Organization: "Viện Nghiên cứu Trí tuệ Nhân tạo Việt Nam",
                    TrustLevel: TrustLevel.Fact
                ));
            }
        }

        var sorted = results.OrderByDescending(r => r.Score).Take(topK).ToList();
        return Task.FromResult<IReadOnlyList<VectorSearchResult>>(sorted);
    }

    public Task DeleteDocumentVectorsAsync(Guid documentId, CancellationToken ct = default)
    {
        var keysToRemove = _store.Where(kv => kv.Value.DocumentId == documentId).Select(kv => kv.Key).ToList();
        foreach (var key in keysToRemove) _store.TryRemove(key, out _);
        return Task.CompletedTask;
    }

    private static float ComputeCosineSimilarity(float[] v1, float[] v2)
    {
        if (v1.Length != v2.Length) return 0f;
        float dot = 0f, norm1 = 0f, norm2 = 0f;
        for (int i = 0; i < v1.Length; i++)
        {
            dot += v1[i] * v2[i];
            norm1 += v1[i] * v1[i];
            norm2 += v2[i] * v2[i];
        }
        if (norm1 == 0 || norm2 == 0) return 0f;
        return dot / (float)(Math.Sqrt(norm1) * Math.Sqrt(norm2));
    }
}
