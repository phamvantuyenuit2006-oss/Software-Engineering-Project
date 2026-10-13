# HỆ THỐNG KIẾN TRÚC TỔNG THỂ (SYSTEM ARCHITECTURE)

**Dự án:** VietAI Life Platform  
**Phiên bản thiết kế:** v1.0 — Production-Ready Architecture  
**Tiêu chuẩn:** Clean Architecture, Modular Monolith / Microservices-Ready, AI Gateway Abstraction

---

## 1. Sơ đồ kiến trúc phân tầng (High-Level Architecture)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (GIAO DIỆN)                         │
│  ┌──────────────────────────────────┐  ┌─────────────────────────────┐ │
│  │     Web App (Next.js / React)    │  │  Mobile App (Expo / React)  │ │
│  │   Desktop / Tablet / Mobile Web  │  │        iOS & Android        │ │
│  └─────────────────┬────────────────┘  └──────────────┬──────────────┘ │
└────────────────────┼──────────────────────────────────┼────────────────┘
                     │           HTTPS / WSS            │
                     ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY & REVERSE PROXY LAYER                   │
│  • SSL Termination     • Rate Limiting (IP/User)    • Security Headers │
│  • CORS Policy         • Request Validation         • Global Logging   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  BACKEND CORE (ASP.NET CORE WEB API)                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ API LAYER: Controllers, Middleware, Auth (JWT), SSE Streaming    │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ APPLICATION LAYER: CQRS (MediatR), DTOs, Validators, Services    │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ DOMAIN LAYER: Entities, Value Objects, Domain Events, Interfaces │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ INFRASTRUCTURE LAYER: EF Core, Repositories, Redis, Background   │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐
│   AI GATEWAY ENGINE   │ │    STORAGE & DATA     │ │ BACKGROUND WORKER  │
│ • IAIProvider Handler │ │ • SQL Server (Relat.) │ │ • Doc Ingestion    │
│ • Model Routing       │ │ • Vector DB (Embed.)  │ │ • OCR & Chunking   │
│ • Agent Orchestrator  │ │ • Redis (Cache/Quota) │ │ • Email & Notifs   │
│ • Trust Verification  │ │ • Object Storage (S3) │ │ • Scheduled Tasks  │
└──────────┬────────────┘ └───────────────────────┘ └────────────────────┘
           │
 ┌─────────┴─────────────────────────────────────────┐
 ▼                   ▼                   ▼           ▼
[OpenAI]         [Gemini]           [Anthropic]   [Local/Ollama]
```

---

## 2. Kiến trúc Backend Clean Architecture (.NET 10)

Cấu trúc thư mục mã nguồn chuẩn tuân thủ nguyên tắc Dependency Inversion:

```
src/
├── Domain/                         # Trọng tâm nghiệp vụ (Zero External Dependencies)
│   ├── Entities/                   # User, Conversation, Message, Document, AgentTask, Memory
│   ├── ValueObjects/               # Email, CitationSource, TokenUsage, TrustScore
│   ├── Enums/                      # UserRole, TaskStatus, TrustLevel, PlanType
│   ├── Events/                     # DocumentProcessedEvent, AgentTaskCompletedEvent
│   └── Interfaces/                 # IRepository, IUnitOfWork, ICurrentUser
│
├── Application/                    # Xử lý quy trình nghiệp vụ (Use Cases)
│   ├── Common/                     # Behaviors (Validation, Logging, Performance)
│   ├── Features/
│   │   ├── Auth/                   # LoginCommand, RegisterCommand, RefreshTokenCommand
│   │   ├── Chat/                   # SendMessageCommand, GetChatHistoryQuery
│   │   ├── Documents/              # UploadDocumentCommand, SearchDocumentQuery
│   │   └── Agent/                  # RunAgentTaskCommand, GetAgentStatusQuery
│   └── Interfaces/                 # IApplicationDbContext, IAIProvider, IVectorStore
│
├── Infrastructure/                 # Cài đặt công nghệ bên ngoài
│   ├── Persistence/                # ApplicationDbContext, EF Core Configurations, Migrations
│   ├── AI/                         # OpenAIProvider, GeminiProvider, LocalLLMProvider
│   ├── VectorDb/                   # PgVectorStore, QdrantVectorStore
│   ├── Storage/                    # LocalFileStorage, S3ObjectStorage
│   └── Services/                   # TokenService, DateTimeService, EmailService
│
├── API/                            # Tầng giao tiếp ngoại vi (Endpoints & Presentation)
│   ├── Controllers/                # AuthController, ChatController, AgentController
│   ├── Middleware/                 # ErrorHandlingMiddleware, SecurityHeadersMiddleware
│   ├── Extensions/                 # ServiceCollectionExtensions, SwaggerExtensions
│   └── Program.cs                  # Entry point & DI Configuration
│
└── Worker/                         # Dịch vụ xử lý ngầm (Background Jobs)
    └── Consumers/                  # DocumentChunkingWorker, EmbeddingGeneratorWorker
```

---

## 3. Kiến trúc AI Provider Abstraction (`IAIProvider`)

Để hệ thống không bao giờ bị "khóa cứng" vào một nhà cung cấp AI duy nhất (Vendor Lock-in), mọi tương tác AI đều thông qua Interface chuẩn:

```csharp
public interface IAIProvider
{
    // 1. Text & Chat Completion with Real-time Streaming
    IAsyncEnumerable<ChatStreamChunk> StreamChatAsync(ChatRequest request, CancellationToken ct = default);
    Task<ChatResponse> GenerateChatAsync(ChatRequest request, CancellationToken ct = default);

    // 2. Vector Embeddings
    Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text, CancellationToken ct = default);
    Task<IReadOnlyList<ReadOnlyMemory<float>>> GenerateEmbeddingsBatchAsync(IEnumerable<string> texts, CancellationToken ct = default);

    // 3. Vision Analysis & Multimodal
    Task<VisionAnalysisResult> AnalyzeImageAsync(VisionRequest request, CancellationToken ct = default);

    // 4. Voice Processing
    Task<string> TranscribeAudioAsync(Stream audioStream, string language = "vi", CancellationToken ct = default);
    Task<Stream> SynthesizeSpeechAsync(string text, string voiceGender = "NorthernFemale", CancellationToken ct = default);
}
```

---

## 4. Kiến trúc Frontend (Next.js 15 Web App)

* **App Router:** Tận dụng Server Components để tối ưu SEO cho Landing Page và Client Components cho Interactive Chat/Agent Dashboard.
* **State Management:** `Zustand` quản lý trạng thái UI, Session và Hội thoại; `TanStack Query (React Query)` quản lý Server State, Caching và Optimistic Updates.
* **UI Design System:** Xây dựng trên `Tailwind CSS` kết hợp `shadcn/ui` và `Lucide Icons`. Thiết kế tối giản, thanh lịch, chuẩn tương phản cao cho người Việt.
