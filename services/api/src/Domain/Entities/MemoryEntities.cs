using VietAILife.Domain.Common;
using VietAILife.Domain.Enums;

namespace VietAILife.Domain.Entities;

public class Memory : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public MemoryType MemoryType { get; set; } = MemoryType.LongTerm;
    public string Title { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<MemoryItem> Items { get; set; } = new List<MemoryItem>();
}

public class MemoryItem : BaseEntity
{
    public Guid MemoryId { get; set; }
    public Memory Memory { get; set; } = null!;

    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; } = 1.0;
    public DateTimeOffset LastAccessedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class UserPreference : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Language { get; set; } = "vi-VN";
    public string DialectTone { get; set; } = "North"; // "North", "Central", "South"
    public string ResponseStyle { get; set; } = "Professional"; // "Professional", "Friendly", "Concise"
    public string Theme { get; set; } = "Light";
    public bool EnableVoiceAutoPlay { get; set; } = false;
    public bool HighContrast { get; set; } = false;
    public double FontScaleFactor { get; set; } = 1.0;
    public bool EnableLongTermMemory { get; set; } = true;
}

public class LearningProfile : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string CurrentLevel { get; set; } = "A2";
    public string TargetExam { get; set; } = "B1 Tiếng Anh";
    public DateTimeOffset? TargetDeadline { get; set; }
    public int WeeklyCommittedHours { get; set; } = 10;
    public string StudyPlanJson { get; set; } = "{}";
}

public class CareerProfile : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string CurrentRole { get; set; } = string.Empty;
    public string TargetRole { get; set; } = string.Empty;
    public string SkillsJson { get; set; } = "[]";
    public string? PortfolioUrl { get; set; }
    public string? ResumeUrl { get; set; }
}
