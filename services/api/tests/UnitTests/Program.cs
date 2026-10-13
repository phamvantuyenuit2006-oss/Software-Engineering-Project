using System;
using System.Threading.Tasks;
using VietAILife.UnitTests;

namespace VietAILife.UnitTests;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        Console.WriteLine("=================================================================");
        Console.WriteLine(" VietAI-Life .NET 10 Automated Test Suite");
        Console.WriteLine(" Testing 3-Tier Architecture & Inter-Service Narration Pipeline");
        Console.WriteLine("=================================================================\n");

        int passed = 0;
        int failed = 0;

        // Test 1: TrustLayer
        try
        {
            var t = new TrustLayerValidatorTests();
            t.ClassifyEpistemicState_ShouldReturnFact_WhenCitationsArePresent();
            t.ClassifyEpistemicState_ShouldReturnUncertainty_WhenDataIsInsufficient();
            t.SanitizeResponse_ShouldEscapeScriptTags_ToPreventXss();
            Console.WriteLine(" [PASS] TrustLayerValidatorTests (3 assertions passed)");
            passed += 3;
        }
        catch (Exception ex)
        {
            Console.WriteLine($" [FAIL] TrustLayerValidatorTests: {ex.Message}");
            failed++;
        }

        // Test 2: TokenService
        try
        {
            var t = new TokenServiceTests();
            t.GenerateAccessToken_ShouldProduceValidToken_WithMatchingUserId();
            t.GenerateRefreshToken_ShouldGenerateNonEmptyRandomString();
            Console.WriteLine(" [PASS] TokenServiceTests (2 assertions passed)");
            passed += 2;
        }
        catch (Exception ex)
        {
            Console.WriteLine($" [FAIL] TokenServiceTests: {ex.Message}");
            failed++;
        }

        // Test 3: NarrationService Microservices Integration
        try
        {
            var t = new NarrationServiceIntegrationTests();
            await t.GenerateNarrationAsync_ShouldCoordinateAcrossMicroservices_AndProduceValidScriptAndMedia();
            Console.WriteLine(" [PASS] NarrationServiceIntegrationTests (Microservices communication passed)");
            passed += 1;
        }
        catch (Exception ex)
        {
            Console.WriteLine($" [FAIL] NarrationServiceIntegrationTests: {ex.Message}");
            failed++;
        }

        Console.WriteLine("\n=================================================================");
        Console.WriteLine($" Summary: {passed} passed, {failed} failed.");
        Console.WriteLine("=================================================================");

        return failed == 0 ? 0 : 1;
    }
}
