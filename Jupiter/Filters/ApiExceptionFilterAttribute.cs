using Jupiter.BLL.Helpers;
using Jupiter.Models.Dtos.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Jupiter.API.Filters
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly ILogger<ApiExceptionFilterAttribute> _logger;
        private readonly IWebHostEnvironment _hostEnv;

        public ApiExceptionFilterAttribute(ILogger<ApiExceptionFilterAttribute> logger, IWebHostEnvironment hostEnv)
        {
            _logger = logger;
            _hostEnv = hostEnv;
        }

        public override Task OnExceptionAsync(ExceptionContext context)
        {
            object details = new object();

            if (_hostEnv.IsDevelopment())
            {
                details = new DetailedException
                {
                    Message = context.Exception.Message,
                    Exception = context.Exception.ToString()
                };
            }

            if (_hostEnv.IsProduction() || _hostEnv.IsStaging())
            {
                details = new ApiErrorResponseDto
                {
                    Message = MessageHelper.GeneralErrors.SOMETHING_WENT_WRONG
                };
            }

            _logger.LogError(exception: context.Exception, message: context.Exception.Message);
            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
            return Task.CompletedTask;
        }
    }
}
