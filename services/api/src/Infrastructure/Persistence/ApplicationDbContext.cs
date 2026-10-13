using Microsoft.EntityFrameworkCore;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Domain.Common;
using VietAILife.Domain.Entities;

namespace VietAILife.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Session> Sessions => Set<Session>();

    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();

    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();
    public DbSet<Embedding> Embeddings => Set<Embedding>();
    public DbSet<KnowledgeCategory> KnowledgeCategories => Set<KnowledgeCategory>();
    public DbSet<KnowledgeSource> KnowledgeSources => Set<KnowledgeSource>();

    public DbSet<Agent> Agents => Set<Agent>();
    public DbSet<AgentTask> AgentTasks => Set<AgentTask>();
    public DbSet<AgentRun> AgentRuns => Set<AgentRun>();
    public DbSet<AgentStep> AgentSteps => Set<AgentStep>();
    public DbSet<Tool> Tools => Set<Tool>();
    public DbSet<ToolDefinition> ToolDefinitions => Set<ToolDefinition>();
    public DbSet<ToolCall> ToolCalls => Set<ToolCall>();

    public DbSet<Memory> Memories => Set<Memory>();
    public DbSet<MemoryItem> MemoryItems => Set<MemoryItem>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<LearningProfile> LearningProfiles => Set<LearningProfile>();
    public DbSet<CareerProfile> CareerProfiles => Set<CareerProfile>();

    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Feedback> Feedback => Set<Feedback>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<AiRequest> AiRequests => Set<AiRequest>();
    public DbSet<AiCost> AiCosts => Set<AiCost>();
    public DbSet<UsageRecord> UsageRecords => Set<UsageRecord>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Composite Keys
        modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
        modelBuilder.Entity<RolePermission>().HasKey(rp => new { rp.RoleId, rp.PermissionId });

        // 2. Indexes & Constraints
        modelBuilder.Entity<User>()
            .HasIndex(u => u.NormalizedEmail)
            .IsUnique();

        modelBuilder.Entity<DocumentChunk>()
            .HasIndex(dc => new { dc.DocumentId, dc.ChunkIndex });

        modelBuilder.Entity<Message>()
            .HasIndex(m => m.ConversationId);

        // 3. Global Soft Delete Query Filter
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Conversation>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Document>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<AgentTask>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Memory>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTimeOffset.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
