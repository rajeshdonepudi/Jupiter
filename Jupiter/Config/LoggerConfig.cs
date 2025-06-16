using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;
using System.Runtime.InteropServices;

namespace Jupiter.API.Config
{
    public static class LoggerConfig
    {
        public static void Configure(WebApplicationBuilder builder)
        {
            builder.Host.UseSerilog((context, services, configuration) =>
            {
                GetLoggerConfiguration(builder, configuration);
            });
        }

        private static LoggerConfiguration GetLoggerConfiguration(WebApplicationBuilder builder,
            LoggerConfiguration configuration)
        {

            configuration.WriteTo.File(GetLogFilePath(), restrictedToMinimumLevel: LogEventLevel.Error, outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}", rollingInterval: RollingInterval.Day)
                         .WriteTo.Console(restrictedToMinimumLevel: LogEventLevel.Debug)
                         .WriteTo.MSSqlServer(connectionString: builder.Configuration.GetConnectionString("Default"), new MSSqlServerSinkOptions
                         {
                             AutoCreateSqlTable = true,
                             TableName = "LogEvents",
                         }, restrictedToMinimumLevel: LogEventLevel.Error);

            return configuration.Enrich.FromLogContext();
        }

        private static string GetLogFilePath()
        {
            string directoryPath;

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                directoryPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "FalconOne_API_Logs");
            }
            else
            {
                directoryPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "FalconOne_API_Logs");
            }

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            return Path.Combine(directoryPath, "log.txt");
        }

    }
}
