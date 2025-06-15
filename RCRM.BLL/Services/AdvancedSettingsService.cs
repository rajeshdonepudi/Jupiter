using IdenticonSharp.Identicons;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class AdvancedSettingsService : BaseService, IAdvancedSettingsService
    {
        private readonly IPasswordHasher<object> _passwordHasher;

        public AdvancedSettingsService(UserManager<User> userManager,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration,
            ITenantProvider tenantService,
            IPasswordHasher<object> passwordHasher, IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {
            _passwordHasher = passwordHasher;
        }

        public async Task<string> HashPasswordAsync(string password)
        {
            var hashedPassword = await Task.FromResult(_passwordHasher.HashPassword(new object(), password));

            return hashedPassword;
        }

        public async Task<bool> UpdateProfileForAllUsers(byte[] data, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.UpdateProfilePictureForAllUsers(data, cancellationToken);

            return result;
        }
    }
}
