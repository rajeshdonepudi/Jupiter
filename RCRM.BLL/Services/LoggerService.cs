using Jupiter.BLL.Interfaces;
using Serilog;

namespace Jupiter.BLL.Services
{
    public class LoggerService : ILoggerService
    {
        private readonly ILogger _logger;

        public LoggerService(ILogger logger)
        {
            _logger = logger;
        }

        public void LogInfo(string message)
        {
            _logger.Information(message);
        }

        public void LogWarn(string message)
        {
            _logger.Warning(message);
        }

        public void LogError(string message, Exception? exception = null)
        {
            if (exception is null)
            {
                _logger.Error(message);
            }
            else
            {
                _logger.Error(message, exception);
            }
        }
    }
}
