using IdenticonSharp.Helpers;
using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Security.Claims;

namespace Jupiter.BLL.Services
{
    public class BaseService
    {
        protected readonly UserManager<User> _userManager;
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly IConfiguration _configuration;
        protected readonly ITenantProvider _tenantProvider;
        protected readonly IIdenticonProvider _identiconProvider;
        protected readonly bool IsGodSession;
        protected readonly Guid TenantId;
        protected readonly string IpAddress;
        protected readonly bool IsAuthenticatedUser;
        protected readonly Guid USER_ID;

        public BaseService(
               UserManager<User> userManager,
               IUnitOfWork unitOfWork,
               IHttpContextAccessor httpContextAccessor,
               IConfiguration configuration,
               ITenantProvider tenantProvider,
               IIdenticonProvider identiconProvider)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _tenantProvider = tenantProvider;
            _identiconProvider = identiconProvider;

            var userClaims = _httpContextAccessor?.HttpContext?.User;

            IsAuthenticatedUser = userClaims?.Identity?.IsAuthenticated ?? false;

            if (IsAuthenticatedUser && userClaims?.Identities != null)
            {
                var claims = userClaims.Identities.SelectMany(identity => identity.Claims).ToList();

                IsGodSession = claims.Any(claim => claim.Type == ClaimTypes.Role && claim.Value == SecurityRoles.GOD);

                TenantId = ParseRequiredClaim(claims, ClaimTypes.System);
                USER_ID = ParseRequiredClaim(claims, ClaimTypes.Actor);
            }

            IpAddress = GetClientIPAddress();
            TenantId = TenantId != Guid.Empty ? TenantId : GetTenantId();
        }

        private static Guid ParseRequiredClaim(IEnumerable<Claim> claims, string claimType)
        {
            var claimValue = claims.FirstOrDefault(claim => claim.Type == claimType)?.Value;
            return Guid.TryParse(claimValue, out var guid) ? guid : Guid.Empty;
        }

        private string GetClientIPAddress()
        {
            string ipAddress = _httpContextAccessor?.HttpContext?.Connection?.RemoteIpAddress?.ToString()!;

            if (IPAddress.TryParse(ipAddress, out var parsedAddress))
            {
                if (parsedAddress.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
                {
                    ipAddress = parsedAddress.MapToIPv4().ToString();
                }
            }
            return ipAddress;
        }

        public Guid GetTenantId()
        {
            var useLocal = _configuration.GetValue<bool>("useLocalTenantId");

            if(useLocal)
            {
                return _configuration.GetValue<Guid>("localTenantId");
            }

            var refererQuery = _httpContextAccessor?.HttpContext?.Request?.Query["referer"].FirstOrDefault() ??
                   _httpContextAccessor?.HttpContext?.Request?.Query["Referer"].FirstOrDefault();

            string referer = _httpContextAccessor?.HttpContext?
                                                  .Request?
                                                  .Headers?
                                                  .Referer
                                                  .ToString()!;

            if (string.IsNullOrEmpty(referer))
            {
                referer = refererQuery!;
            }

            var uri = new Uri(referer.Trim());

            return _unitOfWork.TenantRepository.GetTenantIdByHost(uri.Host);
        }

        protected string FormatIdentityErrors(IEnumerable<IdentityError> identityErrors)
        {
            return string.Join(',', identityErrors.Select(x => x.Description).ToArray());
        }

        protected static bool IsBase64Encoded(string input)
        {
            try
            {
                byte[] buffer = Convert.FromBase64String(input);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        protected string GenerateProfilePicture(byte[] data)
        {
            return _identiconProvider.Create(data).ToBase64();
        }

        protected byte[] GenerateProfilePicture(string input1, string input2)
        {
            return _identiconProvider.Create($"{input1} {input2}").GetBytes();
        }

        protected static string ConvertToBase64(string text)
        {
            string base64String = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(text));

            return base64String;
        }

        private async Task<bool> IsValidTenant(Guid tenantId, Guid userId)
        {
            Tenant? tenant = await _unitOfWork.TenantRepository.FindAsync(tenantId, CancellationToken.None);

            User? user = await _userManager.FindByIdAsync(userId.ToString());

            if (user is not null && tenant is not null)
            {
                bool result = user.Tenants.Any(x => x.TenantId == tenant.Id);

                if (!result)
                {
                    throw new Exception("Unauthorized");
                }

                return result;
            }
            else
            {
                throw new Exception("Invalid request.");
            }
        }

        protected async Task IsVerifiedUser(User user)
        {
            bool isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

            if (!isEmailConfirmed)
            {
                throw new Exception(ErrorMessages.PLEASE_CONFIRM_EMAIL);
            }
        }

        protected bool IsNotEmptyGuid(Guid guid)
        {
            return Guid.Empty != guid;
        }

        protected async Task<bool> IsGodUser(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new Exception(MessageHelper.GeneralErrors.INVALID_EMAIL);
            }

            var user = await _userManager.FindByEmailAsync(email);

            if (user is null)
            {
                throw new Exception(MessageHelper.GeneralErrors.INVALID_REQUEST);
            }

            var isGod = await _userManager.IsInRoleAsync(user, SecurityRoles.GOD);

            return isGod;
        }

        protected void ValidateModelPath(string modelPath)
        {
            if (!File.Exists(modelPath))
            {
                throw new FileNotFoundException($"The model file was not found at: {modelPath}");
            }
        }


    }
}
