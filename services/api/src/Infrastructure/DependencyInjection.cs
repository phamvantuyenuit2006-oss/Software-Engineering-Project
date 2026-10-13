using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Application.Services;
using VietAILife.Infrastructure.AI;
using VietAILife.Infrastructure.Persistence;
using VietAILife.Infrastructure.Services;
using VietAILife.Infrastructure.Storage;
using VietAILife.Infrastructure.VectorDb;

namespace VietAILife.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase", false);
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Server=localhost;Database=VietAILifeDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (useInMemory)
            {
                options.UseInMemoryDatabase("VietAILifeDb");
            }
            else
            {
                options.UseSqlServer(connectionString, b => 
                {
                    b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                    b.EnableRetryOnFailure(3);
                });
            }
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        // Services
        services.AddSingleton<ITokenService, TokenService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<IAIProvider, HybridAIProvider>();
        services.AddSingleton<IVectorStore, InMemoryVectorStore>();
        services.AddSingleton<IStorageService, LocalFileStorageService>();

        // Application Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IRAGService, RAGService>();
        services.AddScoped<IAgentOrchestrator, AgentOrchestrator>();
        services.AddSingleton<ITrustLayerValidator, TrustLayerValidator>();

        // Multilingual Narration Microservices (Đồ án CNPM)
        services.AddSingleton<ITranslationService, TranslationService>();
        services.AddSingleton<ITextToSpeechService, TextToSpeechService>();
        services.AddSingleton<IMediaStorageService, MediaStorageService>();
        services.AddScoped<INarrationService, NarrationService>();

        return services;
    }
}
