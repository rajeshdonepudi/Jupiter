using IdenticonSharp.Identicons;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class PermissionService : BaseService, IPermissionService
    {
        public PermissionService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITenantProvider tenantService, IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {
        }

        public async Task<IEnumerable<SecurityGroupDto>> GetTenantPermissionsAsync(CancellationToken cancellationToken)
        {
            var permissions = await _unitOfWork.PermissionRepository.GetTenantPermissionsAsync(TenantId, cancellationToken);

            return permissions;
        }



        public async Task<IEnumerable<SecurityGroupDto>> GetPermissionsAsync(CancellationToken cancellationToken)
        {
            var permissions = await _unitOfWork.PermissionRepository.GetPermissionsAsync(cancellationToken);

            return permissions;
        }

        public async Task<bool> ManagePermissionsAsync(ManagePermissionsDto permission, CancellationToken cancellationToken)
        {
            return await _unitOfWork.PermissionRepository.ManagePermissionsAsync(TenantId, permission, cancellationToken);
        }

        public async Task<bool> ManagePermissionsForTenantAsync(ManagePermissionsForTenantDto model, CancellationToken cancellationToken)
        {
            return await _unitOfWork.PermissionRepository.ManagePermissionsForTenantAsync(model, cancellationToken);
        }
    }
}
