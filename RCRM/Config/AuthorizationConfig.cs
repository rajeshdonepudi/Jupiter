namespace Jupiter.API.Config
{
    public static class AuthorizationConfig
    {
        public static void Configure(IServiceCollection services)
        {
            services.AddAuthorization();
        }
    }
}
