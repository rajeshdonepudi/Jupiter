namespace Jupiter.BLL.Interfaces
{
    public interface ILoggerService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="message"></param>
        void LogInfo(string message);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="message"></param>
        void LogWarn(string message);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="message"></param>
        /// <param name="exception"></param>
        void LogError(string message, Exception? exception = null);
    }
}
