using Jupiter.BLL.Interfaces;
using Jupiter.DAL;
using Jupiter.Enumerations.Settings;
using Jupiter.Enumerations.Tenant;
using Jupiter.Extensions.Enumerations;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Entities.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Jupiter.API.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class JupiterAuthorizeAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
    {
        private readonly string _claim;
        private IMemoryCache _cache;
        private CacheHelper _cacheHelper;

        public JupiterAuthorizeAttribute(string claim)
        {
            _claim = claim ?? string.Empty;
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            _cache = GetService<IMemoryCache>(context);
            _cacheHelper = GetService<CacheHelper>(context);

            if (context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any())
            {
                return;
            }

            var accessToken = ValidateAndGetBearerToken(context);
            var tenantId = await GetTenantId(context);
            var validationParameters = await GetTokenValidationParameters(context, tenantId);

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var claimsPrincipal = tokenHandler.ValidateToken(accessToken, validationParameters, out _);
                var tokenTenantId = GetClaimInfo("TenantId", claimsPrincipal);
                var userIdClaim = GetClaimInfo(ClaimTypes.Actor, claimsPrincipal);
                var role = GetClaimInfo(ClaimTypes.Role, claimsPrincipal);

                if (Guid.TryParse(tokenTenantId, out Guid accessTokenTenantId) &&
                    Guid.TryParse(userIdClaim, out Guid accessTokenUserId))
                {
                    var userManager = GetService<UserManager<User>>(context);

                    if (await IsGodUserAsync(accessTokenUserId, userManager))
                    {
                        return;
                    }

                    if (tenantId != accessTokenTenantId)
                    {
                        context.Result = new UnauthorizedResult();

                        return;
                    }

                    if (!await CheckPermissions(accessTokenTenantId, accessTokenUserId, context))
                    {
                        context.Result = new ForbidResult();

                        return;
                    }
                }
                else
                {
                    context.Result = new UnauthorizedResult();
                    return;
                }
            }
            catch (Exception)
            {
                context.Result = new UnauthorizedResult();
            }
        }

        private string ValidateAndGetBearerToken(AuthorizationFilterContext authorizationFilterContext)
        {
            var authorizationHeaderInfo = authorizationFilterContext.HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authorizationHeaderInfo) || !authorizationHeaderInfo.StartsWith("Bearer "))
            {
                authorizationFilterContext.Result = new UnauthorizedResult();
            }
            return authorizationHeaderInfo!.Substring(7);
        }

        private async Task<bool> CheckPermissions(Guid tenantId, Guid userId, AuthorizationFilterContext context)
        {
            var userManager = GetService<UserManager<User>>(context);
            var dbContext = GetService<JupiterContext>(context);

            var result = await HasPermissionAsync(userId, dbContext, _claim, tenantId, userManager);

            return result;
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

        private async Task<bool> HasPermissionAsync(Guid userId, JupiterContext context, string permission, Guid tenantId, UserManager<User> userManager)
        {
            bool hasPermission = false;

            var userSecurityGroups = await context.TenantUsers
                                                 .Where(tu => tu.UserId == userId && tu.TenantId == tenantId)
                                                 .SelectMany(tu => tu.TenantUserSecurityGroups)
                                                 .Select(sg => sg.SecurityGroupId)
                                                 .ToListAsync();

            if (userSecurityGroups.Any())
            {
                hasPermission = await context.SecurityGroupPermissions
                                             .AnyAsync(sgp => userSecurityGroups.Contains(sgp.SecurityGroupId) &&
                                                              sgp.Permission.Value == permission);
            }
            else
            {
                var user = await userManager.FindByIdAsync(userId.ToString());
                var claims = await userManager.GetClaimsAsync(user!);

                hasPermission = claims.Any(x => x.Value == permission);
            }
            return hasPermission;
        }

        private async Task<bool> IsGodUserAsync(Guid userId, UserManager<User> userManager)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            return await userManager.IsInRoleAsync(user, SecurityRoles.GOD);
        }

        private async Task<TokenValidationParameters> GetTokenValidationParameters(AuthorizationFilterContext context, Guid tenantId)
        {
            var dbContext = GetService<JupiterContext>(context);
            var configuration = GetService<IConfiguration>(context);
            var secretKey = await GetSettingValue<string>(dbContext, tenantId, TenantPredefinedSettingEnum.SecretKey);
            return new TokenValidationParameters
            {
                ValidIssuer = configuration["JWT:Issuer"],
                ValidAudience = configuration["JWT:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!)),
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero
            };
        }

        private string GetClaimInfo(string key, ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(key) ?? string.Empty;
        }


        private T GetService<T>(AuthorizationFilterContext context)
        {
            return context.HttpContext.RequestServices.GetService<T>()!;
        }

        private async Task<Guid> GetTenantId(AuthorizationFilterContext context)
        {
            var service = GetService<ITenantProvider>(context);

            var tenantId = await service.GetTenantIdAsync();

            return tenantId;
        }
    }
}
