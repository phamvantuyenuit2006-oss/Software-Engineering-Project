using System.Text;
using VietAILife.Application.Common.Interfaces;

namespace VietAILife.Application.Services;

/// <summary>
/// YÊU CẦU ĐỒ ÁN CNPM: BE Dev tạo các services giao tiếp với nhau
/// NarrationService điều phối (Orchestrate) giữa:
/// - TranslationService: Dịch thuật ngữ cảnh đa ngôn ngữ
/// - TextToSpeechService: Tạo âm thanh giọng đọc bản địa
/// - MediaStorageService: Lưu trữ kịch bản & file audio
/// </summary>
public class NarrationService : INarrationService
{
    private readonly ITranslationService _translationService;
    private readonly ITextToSpeechService _ttsService;
    private readonly IMediaStorageService _mediaStorage;
    private readonly IAIProvider _aiProvider;

    public NarrationService(
        ITranslationService translationService,
        ITextToSpeechService ttsService,
        IMediaStorageService mediaStorage,
        IAIProvider aiProvider)
    {
        _translationService = translationService;
        _ttsService = ttsService;
        _mediaStorage = mediaStorage;
        _aiProvider = aiProvider;
    }

    public async Task<NarrationScriptResult> GenerateNarrationAsync(
        string topic,
        string targetLanguage,
        string style,
        string duration,
        string? customText = null,
        CancellationToken ct = default)
    {
        // 1. Service 1: Tạo nội dung thuyết minh cơ sở (Gốc tiếng Việt)
        var baseOverview = $"Chào mừng quý khách đến với di sản {topic}. Nơi đây hội tụ những giá trị văn hóa và lịch sử đặc sắc của dân tộc Việt Nam.";
        var baseSegments = new List<(string start, string end, string textVi)>
        {
            ("00:00", "00:30", $"{topic} có lịch sử hình thành lâu đời, là biểu tượng văn hóa tiêu biểu."),
            ("00:30", "01:05", "Kiến trúc độc đáo tại đây phản ánh trí tuệ và bàn tay tài hoa của các bậc tiền nhân."),
            ("01:05", "01:45", "Khi tham quan, quý khách hãy thả hồn để cảm nhận trọn vẹn nét đẹp trường tồn cùng thời gian.")
        };

        // 2. Service 2 (Giao tiếp liên dịch vụ): Gọi ITranslationService để dịch sang ngôn ngữ đích
        var translatedOverview = await _translationService.TranslateAsync(baseOverview, "vi", targetLanguage, ct);

        var resultSegments = new List<NarrationSegmentDto>();
        var fullTargetScript = new StringBuilder();

        for (int i = 0; i < baseSegments.Count; i++)
        {
            var seg = baseSegments[i];
            var translatedText = await _translationService.TranslateAsync(seg.textVi, "vi", targetLanguage, ct);
            resultSegments.Add(new NarrationSegmentDto(i + 1, seg.start, seg.end, translatedText, seg.textVi));
            fullTargetScript.AppendLine(translatedText);
        }

        // 3. Service 3 (Giao tiếp liên dịch vụ): Gọi ITextToSpeechService để sinh audio
        using var audioStream = await _ttsService.SynthesizeNarrationAudioAsync(fullTargetScript.ToString(), targetLanguage, 1.0, ct);

        // 4. Service 4 (Giao tiếp liên dịch vụ): Gọi IMediaStorageService để lưu trữ audio và phụ đề SRT
        var audioUrl = await _mediaStorage.SaveAudioNarrationAsync(topic, targetLanguage, audioStream, ct);

        var srtBuilder = new StringBuilder();
        foreach (var seg in resultSegments)
        {
            srtBuilder.AppendLine(seg.Id.ToString());
            srtBuilder.AppendLine($"{seg.TimeStart},000 --> {seg.TimeEnd},000");
            srtBuilder.AppendLine(seg.TextTarget);
            srtBuilder.AppendLine(seg.TextVi);
            srtBuilder.AppendLine();
        }

        var subtitleUrl = await _mediaStorage.SaveSubtitleFileAsync(topic, srtBuilder.ToString(), ct);

        return new NarrationScriptResult(
            Title: $"Bản thuyết minh {topic} ({targetLanguage.ToUpper()})",
            Topic: topic,
            TargetLanguage: targetLanguage,
            Overview: translatedOverview,
            Segments: resultSegments,
            CulturalTips: "• Giữ gìn trật tự và vệ sinh môi trường di sản.\n• Tôn trọng phong tục và tín ngưỡng địa phương.",
            AudioUrl: audioUrl,
            SubtitleUrl: subtitleUrl
        );
    }
}
