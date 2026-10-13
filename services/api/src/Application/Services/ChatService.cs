using System.Runtime.CompilerServices;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Application.Common.Models;
using VietAILife.Domain.Entities;
using VietAILife.Domain.Enums;

namespace VietAILife.Application.Services;

public interface IChatService
{
    Task<MessageDto> SendMessageAsync(Guid userId, SendMessageRequest request, CancellationToken ct = default);
    IAsyncEnumerable<ChatStreamChunk> StreamMessageAsync(Guid userId, SendMessageRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<ConversationDto>> GetUserConversationsAsync(Guid userId, CancellationToken ct = default);
    Task<ConversationDto> GetConversationDetailsAsync(Guid userId, Guid conversationId, CancellationToken ct = default);
    Task<bool> DeleteConversationAsync(Guid userId, Guid conversationId, CancellationToken ct = default);
}

public class ChatService : IChatService
{
    private readonly IApplicationDbContext _context;
    private readonly IAIProvider _aiProvider;
    private readonly IRAGService _ragService;
    private readonly ITrustLayerValidator _trustValidator;

    public ChatService(
        IApplicationDbContext context,
        IAIProvider aiProvider,
        IRAGService ragService,
        ITrustLayerValidator trustValidator)
    {
        _context = context;
        _aiProvider = aiProvider;
        _ragService = ragService;
        _trustValidator = trustValidator;
    }

    public async Task<MessageDto> SendMessageAsync(Guid userId, SendMessageRequest request, CancellationToken ct = default)
    {
        var conversation = await GetOrCreateConversationAsync(userId, request.ConversationId, request.Content, request.Model, ct);

        // 1. Lưu tin nhắn User
        var userMsg = new Message
        {
            ConversationId = conversation.Id,
            Role = "user",
            Content = request.Content,
            TokenCount = request.Content.Length / 4
        };
        _context.Messages.Add(userMsg);
        await _context.SaveChangesAsync(ct);

        // 2. RAG Context & Memory Retrieval
        IReadOnlyList<CitationDto> citations = Array.Empty<CitationDto>();
        string contextPrompt = string.Empty;

        if (request.EnableRAG)
        {
            citations = await _ragService.RetrieveRelevantContextAsync(request.Content, topK: 3, ct);
            if (citations.Count > 0)
            {
                contextPrompt = "=== NGUỒN TRI THỨC ĐƯỢC XÁC THỰC (TRUSTED KNOWLEDGE) ===\n" +
                    string.Join("\n\n", citations.Select(c => $"[Nguồn: {c.SourceTitle} | {c.Organization} | Trang {c.PageNumber}]:\n{c.Snippet}")) +
                    "\n=== HẾT NGUỒN TRI THỨC ===\n\nHãy trả lời dựa trên nguồn trên. Nếu dữ liệu không đủ, hãy nói rõ 'Tôi chưa có đủ dữ liệu để xác nhận'.";
            }
        }

        // 3. Gọi AI Provider
        var chatMessages = new List<ChatMessagePrompt>
        {
            new ChatMessagePrompt("system", "Bạn là VietAI Life — Trợ lý AI thông minh, chân thành, thấu hiểu người Việt Nam. Luôn nói sự thật, trích dẫn nguồn khi có, và hỗ trợ người dùng tận tình.\n" + contextPrompt),
            new ChatMessagePrompt("user", request.Content)
        };

        var aiResponse = await _aiProvider.GenerateChatAsync(new ChatRequest(chatMessages, Model: request.Model), ct);

        // 4. Trust Layer & Phân loại Epistemic
        var trustLevel = _trustValidator.ClassifyEpistemicState(aiResponse.Content, citations);
        var sanitizedContent = _trustValidator.SanitizeResponse(aiResponse.Content);

        // 5. Lưu tin nhắn Assistant
        var assistantMsg = new Message
        {
            ConversationId = conversation.Id,
            Role = "assistant",
            Content = sanitizedContent,
            ThoughtProcess = aiResponse.ThoughtProcess,
            TrustLevel = trustLevel,
            TokenCount = aiResponse.CompletionTokens,
            CitationsJson = citations.Count > 0 ? JsonSerializer.Serialize(citations) : null
        };
        _context.Messages.Add(assistantMsg);

        conversation.UpdatedAt = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);

        return new MessageDto(
            assistantMsg.Id,
            assistantMsg.Role,
            assistantMsg.Content,
            assistantMsg.ThoughtProcess,
            assistantMsg.TrustLevel,
            assistantMsg.TokenCount,
            assistantMsg.CreatedAt,
            citations
        );
    }

    public async IAsyncEnumerable<ChatStreamChunk> StreamMessageAsync(
        Guid userId,
        SendMessageRequest request,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        var conversation = await GetOrCreateConversationAsync(userId, request.ConversationId, request.Content, request.Model, ct);

        var userMsg = new Message
        {
            ConversationId = conversation.Id,
            Role = "user",
            Content = request.Content
        };
        _context.Messages.Add(userMsg);
        await _context.SaveChangesAsync(ct);

        IReadOnlyList<CitationDto> citations = Array.Empty<CitationDto>();
        if (request.EnableRAG)
        {
            citations = await _ragService.RetrieveRelevantContextAsync(request.Content, topK: 3, ct);
        }

        var contextPrompt = citations.Count > 0
            ? "Tri thức xác thực:\n" + string.Join("\n", citations.Select(c => $"- {c.SourceTitle}: {c.Snippet}"))
            : "";

        var chatMessages = new List<ChatMessagePrompt>
        {
            new ChatMessagePrompt("system", "Bạn là VietAI Life — Trợ lý AI cho người Việt. " + contextPrompt),
            new ChatMessagePrompt("user", request.Content)
        };

        var fullResponseBuilder = new System.Text.StringBuilder();

        await foreach (var chunk in _aiProvider.StreamChatAsync(new ChatRequest(chatMessages, Model: request.Model), ct))
        {
            fullResponseBuilder.Append(chunk.Delta);
            yield return chunk;
        }

        // Lưu hoàn tất vào DB
        var fullText = fullResponseBuilder.ToString();
        var trustLevel = _trustValidator.ClassifyEpistemicState(fullText, citations);

        var assistantMsg = new Message
        {
            ConversationId = conversation.Id,
            Role = "assistant",
            Content = _trustValidator.SanitizeResponse(fullText),
            TrustLevel = trustLevel,
            CitationsJson = citations.Count > 0 ? JsonSerializer.Serialize(citations) : null
        };
        _context.Messages.Add(assistantMsg);
        conversation.UpdatedAt = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<ConversationDto>> GetUserConversationsAsync(Guid userId, CancellationToken ct = default)
    {
        var convs = await _context.Conversations
            .Where(c => c.UserId == userId && !c.IsDeleted)
            .OrderByDescending(c => c.UpdatedAt ?? c.CreatedAt)
            .ToListAsync(ct);

        return convs.Select(c => new ConversationDto(
            c.Id,
            c.Title,
            c.Summary,
            c.ModelUsed,
            c.Pinned,
            c.UpdatedAt ?? c.CreatedAt,
            null
        )).ToList();
    }

    public async Task<ConversationDto> GetConversationDetailsAsync(Guid userId, Guid conversationId, CancellationToken ct = default)
    {
        var conv = await _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId && !c.IsDeleted, ct);

        if (conv == null) throw new KeyNotFoundException("Không tìm thấy cuộc hội thoại.");

        var messages = conv.Messages.OrderBy(m => m.CreatedAt).Select(m => {
            IReadOnlyList<CitationDto>? cites = null;
            if (!string.IsNullOrEmpty(m.CitationsJson))
            {
                try { cites = JsonSerializer.Deserialize<List<CitationDto>>(m.CitationsJson); } catch { }
            }
            return new MessageDto(m.Id, m.Role, m.Content, m.ThoughtProcess, m.TrustLevel, m.TokenCount, m.CreatedAt, cites);
        }).ToList();

        return new ConversationDto(conv.Id, conv.Title, conv.Summary, conv.ModelUsed, conv.Pinned, conv.UpdatedAt ?? conv.CreatedAt, messages);
    }

    public async Task<bool> DeleteConversationAsync(Guid userId, Guid conversationId, CancellationToken ct = default)
    {
        var conv = await _context.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId, ct);
        if (conv == null) return false;
        conv.IsDeleted = true;
        conv.DeletedAt = DateTimeOffset.UtcNow;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private async Task<Conversation> GetOrCreateConversationAsync(Guid userId, Guid? conversationId, string initialContent, string? model, CancellationToken ct)
    {
        if (conversationId.HasValue)
        {
            var existing = await _context.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId.Value && c.UserId == userId, ct);
            if (existing != null) return existing;
        }

        var title = initialContent.Length > 40 ? initialContent.Substring(0, 40) + "..." : initialContent;
        var newConv = new Conversation
        {
            UserId = userId,
            Title = title,
            ModelUsed = model ?? "vietai-default"
        };
        _context.Conversations.Add(newConv);
        await _context.SaveChangesAsync(ct);
        return newConv;
    }
}
