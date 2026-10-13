namespace VietAILife.Domain.Enums;

public enum UserRoleType
{
    User = 1,
    Support = 2,
    Researcher = 3,
    ContentManager = 4,
    Moderator = 5,
    Admin = 6,
    SuperAdmin = 7
}

public enum TrustLevel
{
    Unspecified = 0,
    Fact = 1,          // Verified data with citation
    Inference = 2,     // Logical conclusion from known data
    Opinion = 3,       // Subjective advice/viewpoint
    Uncertainty = 4    // Insufficient reliable data
}

public enum AgentTaskStatus
{
    Pending = 0,
    Planning = 1,
    Executing = 2,
    AwaitingApproval = 3, // Human-in-the-loop
    Succeeded = 4,
    Failed = 5,
    Cancelled = 6
}

public enum AgentStepType
{
    Plan = 1,
    ToolCall = 2,
    Observation = 3,
    Verification = 4,
    Response = 5
}

public enum DocumentProcessingStatus
{
    Queued = 0,
    Extracting = 1,
    Chunking = 2,
    Embedding = 3,
    Ready = 4,
    Failed = 5
}

public enum MemoryType
{
    ShortTerm = 1,
    LongTerm = 2,
    TaskContext = 3,
    Preference = 4
}
