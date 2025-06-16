using Jupiter.Security;

namespace Jupiter.API.Config
{
    public static class CORSConfig
    {
        public static void Configure(WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(CORSPolicy.ReactAppPolicy, (p) =>
                {
                    p.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:5173", "https://localhost:5173");
                });
            });
        }
    }
}
