using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Application.Common.Models;
using VietAILife.Application.Services;

namespace VietAILife.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase
{
}

[ApiController]
[Route("api/v1/auth")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;
    private readonly ICurrentUserService _currentUser;

    public AuthController(IAuthService authService, ICurrentUserService currentUser)
    {
        _authService = authService;
        _currentUser = currentUser;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        if (_currentUser.UserId == null) return Unauthorized();
        var result = await _authService.GetCurrentUserProfileAsync(_currentUser.UserId.Value);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferenceRequest request)
    {
        if (_currentUser.UserId == null) return Unauthorized();
        var result = await _authService.UpdateUserPreferencesAsync(_currentUser.UserId.Value, request);
        return Ok(new { success = result });
    }
}

[ApiController]
[Route("api/v1/chat")]
public class ChatController : BaseApiController
{
    private readonly IChatService _chatService;
    private readonly ICurrentUserService _currentUser;

    public ChatController(IChatService chatService, ICurrentUserService currentUser)
    {
        _chatService = chatService;
        _currentUser = currentUser;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _chatService.SendMessageAsync(userId, request);
        return Ok(result);
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _chatService.GetUserConversationsAsync(userId);
        return Ok(result);
    }

    [HttpGet("conversations/{id:guid}")]
    public async Task<IActionResult> GetConversation(Guid id)
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _chatService.GetConversationDetailsAsync(userId, id);
        return Ok(result);
    }

    [HttpDelete("conversations/{id:guid}")]
    public async Task<IActionResult> DeleteConversation(Guid id)
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _chatService.DeleteConversationAsync(userId, id);
        return Ok(new { success = result });
    }
}

[ApiController]
[Route("api/v1/documents")]
public class DocumentsController : BaseApiController
{
    private readonly IRAGService _ragService;
    private readonly ICurrentUserService _currentUser;

    public DocumentsController(IRAGService ragService, ICurrentUserService currentUser)
    {
        _ragService = ragService;
        _currentUser = currentUser;
    }

    [HttpPost]
    public async Task<IActionResult> UploadDocument([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("Vui lòng đính kèm tập tin.");
        if (file.Length > 25 * 1024 * 1024) return BadRequest("Dung lượng tập tin vượt quá giới hạn cho phép (25MB).");

        using var stream = file.OpenReadStream();
        var result = await _ragService.IngestDocumentAsync(stream, file.FileName, file.ContentType, _currentUser.UserId);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetDocuments()
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _ragService.GetUserDocumentsAsync(userId);
        return Ok(result);
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchKnowledge([FromBody] SearchKnowledgeRequest request)
    {
        var result = await _ragService.SearchKnowledgeAsync(request);
        return Ok(result);
    }
}

[ApiController]
[Route("api/v1/agents")]
public class AgentController : BaseApiController
{
    private readonly IAgentOrchestrator _agentOrchestrator;
    private readonly ICurrentUserService _currentUser;

    public AgentController(IAgentOrchestrator agentOrchestrator, ICurrentUserService currentUser)
    {
        _agentOrchestrator = agentOrchestrator;
        _currentUser = currentUser;
    }

    [HttpPost("run")]
    public async Task<IActionResult> RunAgentTask([FromBody] RunAgentTaskRequest request)
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _agentOrchestrator.ExecuteTaskAsync(userId, request);
        return Ok(result);
    }

    [HttpGet("tasks")]
    public async Task<IActionResult> GetTasks()
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _agentOrchestrator.GetUserTasksAsync(userId);
        return Ok(result);
    }

    [HttpGet("tasks/{id:guid}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _agentOrchestrator.GetTaskDetailsAsync(userId, id);
        return Ok(result);
    }

    [HttpPost("approve-step")]
    public async Task<IActionResult> ApproveStep([FromBody] ApproveStepRequest request)
    {
        var userId = _currentUser.UserId ?? Guid.Empty;
        var result = await _agentOrchestrator.ApproveStepAsync(userId, request);
        return Ok(result);
    }
}

[ApiController]
[Route("api/v1/admin")]
public class AdminController : BaseApiController
{
    [HttpGet("stats")]
    public IActionResult GetDashboardStats()
    {
        var stats = new DashboardStatsDto(
            TotalUsers: 1250,
            ActiveUsersToday: 480,
            TotalConversations: 8920,
            TotalAgentTasksCompleted: 3410,
            TotalTokensUsed: 14500000,
            EstimatedAiCostUsd: 29.00m,
            EstimatedAiCostVnd: 725000m,
            AverageLatencyMs: 142.5,
            SystemHealthPercent: 99.98
        );
        return Ok(stats);
    }
}
