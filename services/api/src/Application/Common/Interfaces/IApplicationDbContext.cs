using Microsoft.EntityFrameworkCore;
using VietAILife.Domain.Entities;

namespace VietAILife.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<UserProfile> UserProfiles { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Session> Sessions { get; }
    
    DbSet<Conversation> Conversations { get; }
    DbSet<Message> Messages { get; }
    DbSet<MessageAttachment> MessageAttachments { get; }
    
    DbSet<Document> Documents { get; }
    DbSet<DocumentChunk> DocumentChunks { get; }
    DbSet<Embedding> Embeddings { get; }
    DbSet<KnowledgeCategory> KnowledgeCategories { get; }
    DbSet<KnowledgeSource> KnowledgeSources { get; }
    
    DbSet<Agent> Agents { get; }
    DbSet<AgentTask> AgentTasks { get; }
    DbSet<AgentRun> AgentRuns { get; }
    DbSet<AgentStep> AgentSteps { get; }
    DbSet<Tool> Tools { get; }
    DbSet<ToolDefinition> ToolDefinitions { get; }
    DbSet<ToolCall> ToolCalls { get; }
    
    DbSet<Memory> Memories { get; }
    DbSet<MemoryItem> MemoryItems { get; }
    DbSet<UserPreference> UserPreferences { get; }
    DbSet<LearningProfile> LearningProfiles { get; }
    DbSet<CareerProfile> CareerProfiles { get; }
    
    DbSet<Notification> Notifications { get; }
    DbSet<Feedback> Feedback { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<AiRequest> AiRequests { get; }
    DbSet<AiCost> AiCosts { get; }
    DbSet<UsageRecord> UsageRecords { get; }
    DbSet<SystemSetting> SystemSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
