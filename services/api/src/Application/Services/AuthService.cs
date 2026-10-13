using Microsoft.EntityFrameworkCore;
using VietAILife.Application.Common.Interfaces;
using VietAILife.Application.Common.Models;
using VietAILife.Domain.Entities;
using VietAILife.Domain.Enums;

namespace VietAILife.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthResponseDto> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken ct = default);
    Task<UserDto> GetCurrentUserProfileAsync(Guid userId, CancellationToken ct = default);
    Task<bool> UpdateUserPreferencesAsync(Guid userId, UpdatePreferenceRequest request, CancellationToken ct = default);
}

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthService(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        if (await _context.Users.AnyAsync(u => u.NormalizedEmail == normalizedEmail, ct))
        {
            throw new InvalidOperationException("Email này đã được đăng ký trong hệ thống.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email = request.Email.Trim(),
            NormalizedEmail = normalizedEmail,
            PasswordHash = passwordHash,
            IsEmailConfirmed = true,
            Profile = new UserProfile
            {
                FullName = request.FullName.Trim(),
                Occupation = request.Occupation ?? "Thành viên"
            },
            Preference = new UserPreference()
        };

        // Gán Role mặc định: User
        var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleType == UserRoleType.User, ct);
        if (userRole != null)
        {
            user.UserRoles.Add(new UserRole { User = user, Role = userRole });
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(ct);

        return await GenerateAuthResponseAsync(user, ct);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail, ct);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác.");
        }

        return await GenerateAuthResponseAsync(user, ct);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken ct = default)
    {
        var tokenRecord = await _context.RefreshTokens
            .Include(rt => rt.User)
                .ThenInclude(u => u.Profile)
            .Include(rt => rt.User)
                .ThenInclude(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(rt => rt.TokenHash == refreshToken, ct);

        if (tokenRecord == null || !tokenRecord.IsActive)
        {
            throw new UnauthorizedAccessException("Refresh token không hợp lệ hoặc đã hết hạn.");
        }

        tokenRecord.IsRevoked = true;
        tokenRecord.ReplacedByTokenHash = _tokenService.GenerateRefreshToken();

        var newRefreshToken = new RefreshToken
        {
            UserId = tokenRecord.UserId,
            TokenHash = tokenRecord.ReplacedByTokenHash,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(7)
        };
        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync(ct);

        var roles = tokenRecord.User.UserRoles.Select(ur => ur.Role.Name).ToList();
        var accessToken = _tokenService.GenerateAccessToken(tokenRecord.User.Id, tokenRecord.User.Email, roles, Array.Empty<string>());

        var primaryRole = roles.FirstOrDefault() ?? "User";
        var userDto = new UserDto(
            tokenRecord.User.Id,
            tokenRecord.User.Email,
            tokenRecord.User.Profile?.FullName ?? "Người dùng",
            primaryRole,
            tokenRecord.User.Profile?.AvatarUrl,
            tokenRecord.User.Profile?.Occupation
        );

        return new AuthResponseDto(accessToken, newRefreshToken.TokenHash, DateTimeOffset.UtcNow.AddMinutes(15), userDto);
    }

    public async Task<UserDto> GetCurrentUserProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user == null) throw new KeyNotFoundException("Không tìm thấy thông tin người dùng.");

        var role = user.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault() ?? "User";
        return new UserDto(user.Id, user.Email, user.Profile?.FullName ?? "", role, user.Profile?.AvatarUrl, user.Profile?.Occupation);
    }

    public async Task<bool> UpdateUserPreferencesAsync(Guid userId, UpdatePreferenceRequest request, CancellationToken ct = default)
    {
        var pref = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId, ct);
        if (pref == null)
        {
            pref = new UserPreference { UserId = userId };
            _context.UserPreferences.Add(pref);
        }

        pref.ResponseStyle = request.ResponseStyle;
        pref.DialectTone = request.DialectTone;
        pref.Theme = request.Theme;
        pref.HighContrast = request.HighContrast;
        pref.FontScaleFactor = request.FontScaleFactor;
        pref.EnableLongTermMemory = request.EnableLongTermMemory;

        await _context.SaveChangesAsync(ct);
        return true;
    }

    private async Task<AuthResponseDto> GenerateAuthResponseAsync(User user, CancellationToken ct)
    {
        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email, roles, Array.Empty<string>());
        var refreshTokenString = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenString,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(7)
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(ct);

        var primaryRole = roles.FirstOrDefault() ?? "User";
        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.Profile?.FullName ?? "Thành viên",
            primaryRole,
            user.Profile?.AvatarUrl,
            user.Profile?.Occupation
        );

        return new AuthResponseDto(accessToken, refreshTokenString, DateTimeOffset.UtcNow.AddMinutes(15), userDto);
    }
}
