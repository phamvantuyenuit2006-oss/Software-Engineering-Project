using VietAILife.Domain.Common;
using VietAILife.Domain.Enums;

namespace VietAILife.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; set; } = string.Empty;
    public string NormalizedEmail { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString();
    public bool IsEmailConfirmed { get; set; } = false;
    public int Status { get; set; } = 1; // 1: Active, 2: Locked
    
    // Navigation
    public UserProfile? Profile { get; set; }
    public UserPreference? Preference { get; set; }
    public LearningProfile? LearningProfile { get; set; }
    public CareerProfile? CareerProfile { get; set; }
    
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<AgentTask> AgentTasks { get; set; } = new List<AgentTask>();
    public ICollection<Memory> Memories { get; set; } = new List<Memory>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public UserRoleType RoleType { get; set; } = UserRoleType.User;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class Permission : BaseEntity
{
    public string Code { get; set; } = string.Empty; // e.g. "chat:create", "agent:execute"
    public string Module { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class UserRole
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}

public class RolePermission
{
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}

public class UserProfile : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string? Occupation { get; set; } // Học sinh, Sinh viên, Người đi làm, Nông dân, Doanh nhân
    public string? Location { get; set; }
}

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string TokenHash { get; set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; set; }
    public bool IsRevoked { get; set; } = false;
    public string? CreatedByIp { get; set; }
    public string? ReplacedByTokenHash { get; set; }

    public bool IsActive => !IsRevoked && DateTimeOffset.UtcNow < ExpiresAt;
}

public class Session : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string DeviceInfo { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public DateTimeOffset LastActivityAt { get; set; } = DateTimeOffset.UtcNow;
    public bool IsActive { get; set; } = true;
}
