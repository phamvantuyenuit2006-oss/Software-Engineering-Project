using System.Text;
using VietAILife.Application.Common.Interfaces;

namespace VietAILife.Infrastructure.Services;

/// <summary>
/// Service 1: Dịch thuật đa ngôn ngữ ngữ cảnh văn hóa
/// </summary>
public class TranslationService : ITranslationService
{
    private static readonly Dictionary<string, string> EnglishTranslations = new(StringComparer.OrdinalIgnoreCase)
    {
        { "Chào mừng quý khách đến với di sản Văn Miếu - Quốc Tử Giám. Nơi đây hội tụ những giá trị văn hóa và lịch sử đặc sắc của dân tộc Việt Nam.", "Welcome to the Temple of Literature, Vietnam's first imperial academy. This historic sanctuary embodies the scholarly legacy and profound cultural values of the Vietnamese people." },
        { "Văn Miếu - Quốc Tử Giám có lịch sử hình thành lâu đời, là biểu tượng văn hóa tiêu biểu.", "The Temple of Literature has an illustrious history, serving as a prominent symbol of Vietnam's national education." },
        { "Kiến trúc độc đáo tại đây phản ánh trí tuệ và bàn tay tài hoa của các bậc tiền nhân.", "Its distinctive architecture reflects the profound wisdom and master craftsmanship of past generations." },
        { "Khi tham quan, quý khách hãy thả hồn để cảm nhận trọn vẹn nét đẹp trường tồn cùng thời gian.", "As you walk through these ancient courtyards, take a moment to absorb the timeless beauty that has endured for a millennium." }
    };

    public Task<string> TranslateAsync(string text, string fromLanguage, string toLanguage, CancellationToken ct = default)
    {
        if (string.Equals(fromLanguage, toLanguage, StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(text);
        }

        if (toLanguage.Equals("en", StringComparison.OrdinalIgnoreCase) && EnglishTranslations.TryGetValue(text, out var enText))
        {
            return Task.FromResult(enText);
        }

        // Dịch thuật tổng quát với prefix mô phỏng
        var prefix = toLanguage.ToLower() switch
        {
            "en" => "[English Narration] ",
            "fr" => "[Français Narration] ",
            "zh" => "[中文解说] ",
            "ja" => "[日本語音声案内] ",
            "ko" => "[한국어 해설] ",
            _ => $"[{toLanguage.ToUpper()}] "
        };

        return Task.FromResult($"{prefix}{text}");
    }
}

/// <summary>
/// Service 2: Tổng hợp giọng nói TTS
/// </summary>
public class TextToSpeechService : ITextToSpeechService
{
    public Task<Stream> SynthesizeNarrationAudioAsync(string text, string targetLanguage, double speed = 1.0, CancellationToken ct = default)
    {
        // Giả lập luồng âm thanh WAV/MP3 header hợp lệ
        var mockAudioBytes = Encoding.UTF8.GetBytes($"RIFF-MOCK-AUDIO-DATA-FOR-LANG-{targetLanguage}-SPEED-{speed}:{text}");
        Stream stream = new MemoryStream(mockAudioBytes);
        return Task.FromResult(stream);
    }
}

/// <summary>
/// Service 3: Lưu trữ và phân phối tệp phương tiện đa phương tiện
/// </summary>
public class MediaStorageService : IMediaStorageService
{
    public Task<string> SaveAudioNarrationAsync(string topic, string targetLanguage, Stream audioStream, CancellationToken ct = default)
    {
        var slug = topic.ToLower().Replace(" ", "-").Replace("/", "-");
        var audioUrl = $"/media/audio/narrations/{slug}-{targetLanguage}.mp3";
        return Task.FromResult(audioUrl);
    }

    public Task<string> SaveSubtitleFileAsync(string topic, string srtContent, CancellationToken ct = default)
    {
        var slug = topic.ToLower().Replace(" ", "-").Replace("/", "-");
        var srtUrl = $"/media/subtitles/narrations/{slug}.srt";
        return Task.FromResult(srtUrl);
    }
}
