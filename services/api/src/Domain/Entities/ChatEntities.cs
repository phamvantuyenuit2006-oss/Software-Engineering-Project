using VietAILife.Domain.Common;
using VietAILife.Domain.Enums;

namespace VietAILife.Domain.Entities;

public class Conversation : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Title { get; set; } = "Cuộc trò chuyện mới";
    public string? Summary { get; set; }
    public string ModelUsed { get; set; } = "vietai-default";
    public bool Pinned { get; set; } = false;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}

public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;

    public string Role { get; set; } = "user"; // "user", "assistant", "system", "tool"
    public string Content { get; set; } = string.Empty;
    public string? ThoughtProcess { get; set; } // Chain-of-thought / Reasoning
    public TrustLevel TrustLevel { get; set; } = TrustLevel.Unspecified;
    public int TokenCount { get; set; } = 0;
    
    // Metadata trích dẫn nguồn
    public string? CitationsJson { get; set; } // Danh sách trích dẫn [{"source":"...", "url":"...", "updatedDate":"..."}]

    public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
}

public class MessageAttachment : BaseEntity
{
    public Guid MessageId { get; set; }
    public Message Message { get; set; } = null!;

    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public string StorageUrl { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
}
