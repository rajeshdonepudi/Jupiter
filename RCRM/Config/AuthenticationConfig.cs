using Jupiter.API.Providers;
using Jupiter.DAL;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Jupiter.API.Config
{
    public static class AuthenticationConfig
    {
        public static void Configure(WebApplicationBuilder builder)
        {
            builder.Services.AddIdentity<User, ApplicationRole>(options =>
            {
                options.User.RequireUniqueEmail = true;

                options.Password = new PasswordOptions
                {
                    RequireDigit = true,
                    RequiredLength = 8,
                    RequireLowercase = true,
                    RequireUppercase = true,
                };

                options.SignIn.RequireConfirmedPhoneNumber = false;
                options.SignIn.RequireConfirmedEmail = true;
                options.Stores.MaxLengthForKeys = 6;
                options.SignIn.RequireConfirmedAccount = true;
                options.Lockout.AllowedForNewUsers = true;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.MaxFailedAccessAttempts = 3;


            }).AddEntityFrameworkStores<JupiterContext>()
              .AddDefaultTokenProviders()
              .AddTokenProvider<JupiterConfirmationTokenProvider<User>>("JupiterEmailConfirmationTokenProvider");

            builder.Services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = builder.Configuration["JWT:Issuer"],
                    ValidAudience = builder.Configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey
                        (Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]!)),
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    RequireExpirationTime = true,
                    ValidateIssuerSigningKey = false,
                    ClockSkew = TimeSpan.Zero
                };

                o.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(accessToken) &&
                            context.HttpContext.WebSockets.IsWebSocketRequest)
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        }
    }
}
