using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Application.Common.Models;
using VietAILife.Application.Services;
using VietAILife.Domain.Entities;
using VietAILife.Domain.Enums;
using VietAILife.Infrastructure.Persistence;
using VietAILife.Infrastructure.Services;
using Xunit;

namespace VietAILife.UnitTests;

public class TrustLayerValidatorTests
{
    private readonly TrustLayerValidator _validator = new();

    [Fact]
    public void ClassifyEpistemicState_ShouldReturnFact_WhenCitationsArePresent()
    {
        // Arrange
        var citations = new List<CitationDto>
        {
            new("Bộ GD&ĐT", "https://moet.gov.vn", "Bộ GD&ĐT", "2026", 1, "Quy chế thi")
        };
        var content = "Theo quy chế của Bộ Giáo dục và Đào tạo, chuẩn đầu ra B1 áp dụng cho sinh viên tốt nghiệp.";

        // Act
        var result = _validator.ClassifyEpistemicState(content, citations);

        // Assert
        result.Should().Be(TrustLevel.Fact);
    }

    [Fact]
    public void ClassifyEpistemicState_ShouldReturnUncertainty_WhenDataIsInsufficient()
    {
        // Arrange
        var content = "Tôi chưa có đủ dữ liệu từ nguồn tin cậy để xác nhận thông tin này.";

        // Act
        var result = _validator.ClassifyEpistemicState(content, null);

        // Assert
        result.Should().Be(TrustLevel.Uncertainty);
    }

    [Fact]
    public void SanitizeResponse_ShouldEscapeScriptTags_ToPreventXss()
    {
        // Arrange
        var dirtyContent = "Xin chào <script>alert('hack')</script>!";

        // Act
        var clean = _validator.SanitizeResponse(dirtyContent);

        // Assert
        clean.Should().NotContain("<script>");
        clean.Should().Contain("&lt;script&gt;");
    }
}

public class TokenServiceTests
{
    private readonly TokenService _tokenService;

    public TokenServiceTests()
    {
        var configMock = new Mock<IConfiguration>();
        configMock.Setup(c => c["Jwt:Secret"]).Returns("VietAILife_Super_Secret_Key_Production_Ready_2026_Minimum_256_Bits!");
        configMock.Setup(c => c["Jwt:Issuer"]).Returns("vietai-life-api");
        configMock.Setup(c => c["Jwt:Audience"]).Returns("vietai-life-clients");

        _tokenService = new TokenService(configMock.Object);
    }

    [Fact]
    public void GenerateAccessToken_ShouldProduceValidToken_WithMatchingUserId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var email = "test@vietailife.vn";
        var roles = new[] { "Admin", "User" };

        // Act
        var token = _tokenService.GenerateAccessToken(userId, email, roles, Array.Empty<string>());
        var isValid = _tokenService.ValidateToken(token, out var extractedUserId);

        // Assert
        token.Should().NotBeNullOrWhiteSpace();
        isValid.Should().BeTrue();
        extractedUserId.Should().Be(userId);
    }

    [Fact]
    public void GenerateRefreshToken_ShouldGenerateNonEmptyRandomString()
    {
        // Act
        var token1 = _tokenService.GenerateRefreshToken();
        var token2 = _tokenService.GenerateRefreshToken();

        // Assert
        token1.Should().NotBeNullOrWhiteSpace();
        token2.Should().NotBeNullOrWhiteSpace();
        token1.Should().NotBe(token2);
    }
}

public class NarrationServiceIntegrationTests
{
    [Fact]
    public async Task GenerateNarrationAsync_ShouldCoordinateAcrossMicroservices_AndProduceValidScriptAndMedia()
    {
        // Arrange (Setup mock microservices)
        var translationMock = new Mock<ITranslationService>();
        translationMock
            .Setup(t => t.TranslateAsync(It.IsAny<string>(), It.IsAny<string>(), "en", It.IsAny<CancellationToken>()))
            .ReturnsAsync((string txt, string from, string to, CancellationToken ct) => $"[EN] {txt}");

        var ttsMock = new Mock<ITextToSpeechService>();
        ttsMock
            .Setup(s => s.SynthesizeNarrationAudioAsync(It.IsAny<string>(), "en", 1.0, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new MemoryStream(System.Text.Encoding.UTF8.GetBytes("MOCK_AUDIO")));

        var storageMock = new Mock<IMediaStorageService>();
        storageMock
            .Setup(m => m.SaveAudioNarrationAsync(It.IsAny<string>(), "en", It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("/media/audio/van-mieu-en.mp3");

        storageMock
            .Setup(m => m.SaveSubtitleFileAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("/media/subtitles/van-mieu.srt");

        var aiProviderMock = new Mock<IAIProvider>();

        var narrationService = new NarrationService(
            translationMock.Object,
            ttsMock.Object,
            storageMock.Object,
            aiProviderMock.Object
        );

        // Act
        var result = await narrationService.GenerateNarrationAsync(
            topic: "Văn Miếu - Quốc Tử Giám",
            targetLanguage: "en",
            style: "inspirational",
            duration: "medium"
        );

        // Assert (Kiểm chứng kết quả từ 4 services liên kết)
        result.Should().NotBeNull();
        result.Topic.Should().Be("Văn Miếu - Quốc Tử Giám");
        result.TargetLanguage.Should().Be("en");
        result.Overview.Should().StartWith("[EN]");
        result.Segments.Should().HaveCount(3);
        result.AudioUrl.Should().Be("/media/audio/van-mieu-en.mp3");
        result.SubtitleUrl.Should().Be("/media/subtitles/van-mieu.srt");

        // Verify Service-to-Service communications occurred
        translationMock.Verify(t => t.TranslateAsync(It.IsAny<string>(), "vi", "en", It.IsAny<CancellationToken>()), Times.AtLeast(3));
        ttsMock.Verify(s => s.SynthesizeNarrationAudioAsync(It.IsAny<string>(), "en", 1.0, It.IsAny<CancellationToken>()), Times.Once);
        storageMock.Verify(m => m.SaveAudioNarrationAsync(It.IsAny<string>(), "en", It.IsAny<Stream>(), It.IsAny<CancellationToken>()), Times.Once);
        storageMock.Verify(m => m.SaveSubtitleFileAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}

