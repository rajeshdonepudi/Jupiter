using IdenticonSharp.Identicons;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class UserLookupService : BaseService, IUserLookupService
    {
        public UserLookupService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITenantProvider tenantService, IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {

        }

        public async Task<IEnumerable<UserLookupDto>> GetAllUsersLookup(string searchTerm, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetAllTenantUsersLookupAsync(TenantId, searchTerm, cancellationToken);

            return result;
        }

        public async Task<IEnumerable<UserLookupDto>> GetAllUsersLookupByTenantId(Guid tenantId, string searchTerm, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetAllTenantUsersLookupAsync(tenantId, searchTerm, cancellationToken);

            return result;
        }
    }
}
