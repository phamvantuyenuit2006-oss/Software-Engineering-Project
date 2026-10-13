using VietAILife.Domain.Enums;

namespace VietAILife.Application.Common.Models;

// --- Auth DTOs ---
public record RegisterRequest(string Email, string Password, string FullName, string? Occupation);
public record LoginRequest(string Email, string Password);
public record RefreshTokenRequest(string RefreshToken);
public record AuthResponseDto(string AccessToken, string RefreshToken, DateTimeOffset ExpiresAt, UserDto User);
public record UserDto(Guid Id, string Email, string FullName, string Role, string? AvatarUrl, string? Occupation);
public record UpdatePreferenceRequest(string ResponseStyle, string DialectTone, string Theme, bool HighContrast, double FontScaleFactor, bool EnableLongTermMemory);

// --- Chat & Conversation DTOs ---
public record SendMessageRequest(
    Guid? ConversationId,
    string Content,
    string? Model = "vietai-standard",
    bool EnableRAG = true,
    bool EnableMemory = true
);

public record CitationDto(
    string SourceTitle,
    string? Url,
    string? Organization,
    string? UpdatedDate,
    int? PageNumber,
    string Snippet
);

public record MessageDto(
    Guid Id,
    string Role,
    string Content,
    string? ThoughtProcess,
    TrustLevel TrustLevel,
    int TokenCount,
    DateTimeOffset CreatedAt,
    IReadOnlyList<CitationDto>? Citations
);

public record ConversationDto(
    Guid Id,
    string Title,
    string? Summary,
    string ModelUsed,
    bool Pinned,
    DateTimeOffset UpdatedAt,
    IReadOnlyList<MessageDto>? Messages
);

// --- Document & RAG DTOs ---
public record DocumentDto(
    Guid Id,
    string Title,
    string? SourceUrl,
    string MimeType,
    long FileSizeBytes,
    DocumentProcessingStatus Status,
    TrustLevel TrustLevel,
    DateTimeOffset CreatedAt,
    int ChunkCount
);

public record SearchKnowledgeRequest(string Query, int TopK = 5, string? Category = null);

public record KnowledgeSearchResultDto(
    Guid DocumentId,
    string Title,
    string Snippet,
    int? PageNumber,
    float RelevanceScore,
    string? Url,
    string? Organization,
    TrustLevel TrustLevel
);

// --- Agent Engine DTOs ---
public record RunAgentTaskRequest(
    string GoalTitle,
    string GoalDescription,
    string? ContextDetails,
    string Category = "Education"
);

public record AgentStepDto(
    Guid Id,
    int StepNumber,
    AgentStepType StepType,
    string Title,
    string ActionDetails,
    string? Observation,
    bool IsSuccess,
    long ExecutionTimeMs
);

public record AgentTaskDto(
    Guid Id,
    string Title,
    string GoalDescription,
    AgentTaskStatus Status,
    string? FinalResult,
    DateTimeOffset CreatedAt,
    DateTimeOffset? FinishedAt,
    IReadOnlyList<AgentStepDto> Steps
);

public record ApproveStepRequest(Guid StepId, bool IsApproved, string? FeedbackNotes);

// --- Admin & Dashboard DTOs ---
public record DashboardStatsDto(
    int TotalUsers,
    int ActiveUsersToday,
    int TotalConversations,
    int TotalAgentTasksCompleted,
    int TotalTokensUsed,
    decimal EstimatedAiCostUsd,
    decimal EstimatedAiCostVnd,
    double AverageLatencyMs,
    double SystemHealthPercent
);
