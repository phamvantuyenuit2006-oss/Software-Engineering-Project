using VietAILife.Domain.Common;
using VietAILife.Domain.Enums;

namespace VietAILife.Domain.Entities;

public class Agent : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string CapabilityFlags { get; set; } = "chat,tools,planning,memory";
    public bool IsSystem { get; set; } = true;

    public ICollection<AgentTask> AgentTasks { get; set; } = new List<AgentTask>();
}

public class AgentTask : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? AgentId { get; set; }
    public Agent? Agent { get; set; }

    public string Title { get; set; } = string.Empty;
    public string GoalDescription { get; set; } = string.Empty;
    public AgentTaskStatus Status { get; set; } = AgentTaskStatus.Pending;
    public string? FinalResult { get; set; }
    public DateTimeOffset? FinishedAt { get; set; }

    public ICollection<AgentRun> Runs { get; set; } = new List<AgentRun>();
}

public class AgentRun : BaseEntity
{
    public Guid TaskId { get; set; }
    public AgentTask Task { get; set; } = null!;

    public int RunNumber { get; set; } = 1;
    public DateTimeOffset StartTime { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? EndTime { get; set; }
    public int TotalSteps { get; set; } = 0;
    public AgentTaskStatus Status { get; set; } = AgentTaskStatus.Executing;

    public ICollection<AgentStep> Steps { get; set; } = new List<AgentStep>();
}

public class AgentStep : BaseEntity
{
    public Guid RunId { get; set; }
    public AgentRun Run { get; set; } = null!;

    public int StepNumber { get; set; }
    public AgentStepType StepType { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ActionDetailsJson { get; set; } = string.Empty;
    public string? Observation { get; set; }
    public long ExecutionTimeMs { get; set; }
    public bool IsSuccess { get; set; } = true;

    public ICollection<ToolCall> ToolCalls { get; set; } = new List<ToolCall>();
}

public class Tool : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string PermissionRequired { get; set; } = "None"; // "None", "RequiresUserApproval"
    public bool IsEnabled { get; set; } = true;

    public ToolDefinition? Definition { get; set; }
    public ICollection<ToolCall> ToolCalls { get; set; } = new List<ToolCall>();
}

public class ToolDefinition : BaseEntity
{
    public Guid ToolId { get; set; }
    public Tool Tool { get; set; } = null!;

    public string JsonSchema { get; set; } = "{}";
    public string Description { get; set; } = string.Empty;
    public string Version { get; set; } = "1.0";
}

public class ToolCall : BaseEntity
{
    public Guid StepId { get; set; }
    public AgentStep Step { get; set; } = null!;

    public Guid ToolId { get; set; }
    public Tool Tool { get; set; } = null!;

    public string InputParametersJson { get; set; } = "{}";
    public string? OutputResultJson { get; set; }
    public bool IsSuccess { get; set; } = true;
    public string? ErrorDetails { get; set; }
}
