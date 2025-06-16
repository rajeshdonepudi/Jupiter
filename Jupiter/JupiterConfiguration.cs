using IdenticonSharp.Identicons;
using IdenticonSharp.Identicons.Defaults.GitHub;
using Jupiter.API.Config;
using Jupiter.API.Filters;
using Jupiter.API.Providers;
using Jupiter.DAL;
using KE.IdenticonSharp.AspNetCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Jupiter.API
{
    public static class JupiterConfiguration
    {
        public static void Register(WebApplicationBuilder builder, CancellationToken cancellationToken)
        {
            RegisterBaseConfigurations(builder, cancellationToken);

            DependencyConfig.Configure(builder);

            AuthenticationConfig.Configure(builder);

            SwaggerConfig.Configure(builder);

            AuthorizationConfig.Configure(builder.Services);

            CacheConfig.Configure(builder);

            CORSConfig.Configure(builder);

            RateLimiterConfig.Configure(builder);

            LoggerConfig.Configure(builder);
        }

        public static void Bootstrap(IServiceProvider serviceProvider)
        {
            DatabaseConfig.Configure(serviceProvider);
        }

        public static void Seed(IServiceProvider serviceProvider, CancellationToken cancellationToken)
        {
            DbSeeder.Seed(serviceProvider, cancellationToken);
        }

        private static void RegisterBaseConfigurations(WebApplicationBuilder builder, CancellationToken cancellationToken)
        {
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddHealthChecks();
            builder.Services.AddHttpClient();
            builder.Services.AddSignalR();

            builder.Services.AddIdenticonSharp<GitHubIdenticonProvider, GitHubIdenticonOptions>(options =>
            {
                options.SpriteSize = 10;
                options.Size = 256;
                options.HashAlgorithm = HashProvider.SHA512;
            });

            builder.Services.AddControllersWithViews(c =>
            {
                c.Filters.Add<ApiExceptionFilterAttribute>();
                c.Filters.Add<ApiResponseFilterAttribute>();
            });

            builder.Services.AddSingleton<IUserIdProvider, CustomUserIdentifierProvider>();
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
            builder.Services.AddDbContext<JupiterContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
        }
    }
}
