using VietAILife.Domain.Common;

namespace VietAILife.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = "System"; // "System", "AgentTask", "Learning"
    public bool IsRead { get; set; } = false;
    public string? ActionUrl { get; set; }
}

public class Feedback : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? MessageId { get; set; }
    public int Rating { get; set; } // 1 to 5 stars
    public string? Comment { get; set; }
    public string Category { get; set; } = "General";
}

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? OldValuesJson { get; set; }
    public string? NewValuesJson { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}

public class AiRequest : BaseEntity
{
    public Guid? UserId { get; set; }
    public string ModelName { get; set; } = string.Empty;
    public string FeatureName { get; set; } = "Chat";
    public int PromptTokens { get; set; } = 0;
    public int CompletionTokens { get; set; } = 0;
    public int TotalTokens { get; set; } = 0;
    public long LatencyMs { get; set; } = 0;
    public int StatusCode { get; set; } = 200;
    public string TraceId { get; set; } = Guid.NewGuid().ToString();

    public AiCost? Cost { get; set; }
}

public class AiCost : BaseEntity
{
    public Guid RequestId { get; set; }
    public AiRequest Request { get; set; } = null!;

    public decimal EstimatedCostUsd { get; set; } = 0m;
    public decimal EstimatedCostVnd { get; set; } = 0m;
    public string PricingTier { get; set; } = "Standard";
}

public class UsageRecord : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public int TotalRequests { get; set; }
    public int TotalTokensUsed { get; set; }
    public int TokenQuotaLimit { get; set; } = 500000;
}

public class SystemSetting : AuditableEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string DataType { get; set; } = "String"; // "String", "Boolean", "Number", "Json"
    public string Category { get; set; } = "General";
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; } = false;
}
