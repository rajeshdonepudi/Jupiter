using Jupiter.BLL.Interfaces;
using Jupiter.DAL;
using Jupiter.Enumerations.Settings;
using Jupiter.Enumerations.Tenant;
using Jupiter.Extensions.Enumerations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Jupiter.BLL.Services
{
    public class TokenValidationService : ITokenValidationService
    {
        private readonly IConfiguration _configuration;
        private readonly JupiterContext _falconOneContext;
        private readonly IMemoryCache _cache;

        public TokenValidationService(IConfiguration configuration, JupiterContext falconOneContext, IMemoryCache memoryCache)
        {
            _configuration = configuration;
            _falconOneContext = falconOneContext;
            _cache = memoryCache;
        }

        /// <summary>
        /// Validates the provided JWT token.
        /// </summary>
        /// <param name="token">The JWT token to validate.</param>
        /// <returns>ClaimsPrincipal if the token is valid; otherwise null.</returns>
        public ClaimsPrincipal? ValidateToken(string token, Guid tenantId)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentException("Token cannot be null or empty.", nameof(token));

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var validationParameters = GetTokenValidationParameters(tenantId).Result;
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch (SecurityTokenException)
            {
                // Token validation failed
                return null;
            }
        }

        /// <summary>
        /// Validates the token and extracts all claims if the token is valid.
        /// </summary>
        /// <param name="token">The JWT token to validate and extract claims from.</param>
        /// <returns>A dictionary containing claim types and their values if the token is valid; otherwise, null.</returns>
        public IDictionary<string, string>? GetAllClaims(string token, Guid tenantId)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentException("Token cannot be null or empty.", nameof(token));

            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var validationParameters = GetTokenValidationParameters(tenantId).Result;
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

                // Extract claims from the validated token
                return principal.Claims.Where(x => x.Type != ClaimTypes.Role).ToDictionary(claim => claim.Type, claim => claim.Value);
            }
            catch (SecurityTokenException)
            {
                // Token validation failed
                return null;
            }
            catch (Exception ex)
            {
                // Handle unexpected errors
                throw new InvalidOperationException("An error occurred while validating the token and extracting claims.", ex);
            }
        }

        private async Task<TokenValidationParameters> GetTokenValidationParameters(Guid tenantId)
        {
            var secretKey = await GetSettingValue<string>(_falconOneContext, tenantId, TenantPredefinedSettingEnum.SecretKey);
            return new TokenValidationParameters
            {
                ValidIssuer = _configuration["JWT:Issuer"],
                ValidAudience = _configuration["JWT:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!)),
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero
            };
        }

        private async Task<T> GetSettingValue<T>(JupiterContext context, Guid tenantId, TenantPredefinedSettingEnum setting)
        {
            var cacheKey = $"{tenantId}_{setting}";
            if (!_cache.TryGetValue(cacheKey, out T result))
            {
                var settingValue = await context.Settings.FirstOrDefaultAsync(x => x.TenantId == tenantId &&
                                            x.SettingType == SettingTypeEnum.Predefined &&
                                            x.Name == setting.GetDisplayName());

                if (settingValue is null)
                {
                    throw new Exception("Something went wrong in authz");
                }

                result = (T)Convert.ChangeType(settingValue.Value, typeof(T));
                _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
            }

            return result;
        }
    }
}
