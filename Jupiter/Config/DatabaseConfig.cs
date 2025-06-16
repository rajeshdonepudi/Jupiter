using Jupiter.DAL;
using Microsoft.EntityFrameworkCore;

namespace Jupiter.API.Config
{
    public static class DatabaseConfig
    {
        public static void Configure(IServiceProvider serviceProvider)
        {
            using (IServiceScope scope = serviceProvider.CreateScope())
            {
                JupiterContext? context = scope.ServiceProvider.GetService<JupiterContext>();

                if (context is not null)
                {
                    bool hasPendingMigrations = context.Database.GetPendingMigrations().Any();

                    if (hasPendingMigrations)
                    {
                        context.Database.Migrate();
                    }
                }
            }
        }
    }
}
