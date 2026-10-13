using VietAILife.Domain.Common;
using VietAILife.Domain.Enums;

namespace VietAILife.Domain.Entities;

public class KnowledgeCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<KnowledgeSource> Sources { get; set; } = new List<KnowledgeSource>();
}

public class KnowledgeSource : AuditableEntity
{
    public Guid CategoryId { get; set; }
    public KnowledgeCategory Category { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string VerificationStatus { get; set; } = "Verified";
    public DateTimeOffset? LastCrawledAt { get; set; }

    public ICollection<Document> Documents { get; set; } = new List<Document>();
}

public class Document : AuditableEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public Guid? SourceId { get; set; }
    public KnowledgeSource? Source { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? SourceUrl { get; set; }
    public string FileStoragePath { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DocumentProcessingStatus ProcessingStatus { get; set; } = DocumentProcessingStatus.Queued;
    public string? ErrorMessage { get; set; }
    public TrustLevel TrustLevel { get; set; } = TrustLevel.Fact;

    public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
}

public class DocumentChunk : BaseEntity
{
    public Guid DocumentId { get; set; }
    public Document Document { get; set; } = null!;

    public int ChunkIndex { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? PageNumber { get; set; }
    public int TokenLength { get; set; }
    public string? MetadataJson { get; set; }

    public ICollection<Embedding> Embeddings { get; set; } = new List<Embedding>();
}

public class Embedding : BaseEntity
{
    public Guid ChunkId { get; set; }
    public DocumentChunk Chunk { get; set; } = null!;

    public string ModelName { get; set; } = "text-embedding-3-small";
    public int VectorDimensions { get; set; } = 1536;
    public byte[]? VectorBinary { get; set; } // Serialization for SQL Server
}
