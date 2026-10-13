using System.Net;
using System.Text.Json;

namespace VietAILife.API.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var errorCode = "INTERNAL_SERVER_ERROR";
        var userFriendlyMessage = "Đã xảy ra sự cố trong quá trình xử lý yêu cầu.";

        if (exception is UnauthorizedAccessException)
        {
            code = HttpStatusCode.Unauthorized;
            errorCode = "UNAUTHORIZED";
            userFriendlyMessage = exception.Message;
        }
        else if (exception is KeyNotFoundException)
        {
            code = HttpStatusCode.NotFound;
            errorCode = "NOT_FOUND";
            userFriendlyMessage = exception.Message;
        }
        else if (exception is InvalidOperationException)
        {
            code = HttpStatusCode.BadRequest;
            errorCode = "BAD_REQUEST";
            userFriendlyMessage = exception.Message;
        }

        var response = new
        {
            success = false,
            error = new
            {
                code = errorCode,
                message = userFriendlyMessage,
                traceId = context.TraceIdentifier
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}

public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["X-Frame-Options"] = "DENY";
        context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
        context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline';";

        await _next(context);
    }
}
