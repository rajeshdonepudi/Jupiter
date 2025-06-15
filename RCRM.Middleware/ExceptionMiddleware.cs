using Jupiter.BLL.Interfaces;
using Jupiter.Helpers.Helpers;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

namespace Jupiter.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILoggerService _loggerService;

        public ExceptionMiddleware(RequestDelegate next, ILoggerService loggerService)
        {
            _next = next;
            _loggerService = loggerService;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _loggerService.LogError($"Something went wrong: {ex}");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            if (exception is BusinessException businessException)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    context?.Response?.StatusCode,
                    businessException?.Message,
                    businessException?.ErrorCode
                }));
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    context.Response.StatusCode,
                    Message = "Internal Server Error. Please try again later."
                }));
            }
        }
    }
}
