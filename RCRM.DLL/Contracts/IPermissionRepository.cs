using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IPermissionRepository : IGenericRepository<Permission>
    {
        /// <summary>
        ///  Manage permissions for tenant.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> ManagePermissionsForTenantAsync(ManagePermissionsForTenantDto model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> ManagePermissionsAsync(Guid tenantId, ManagePermissionsDto model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<SecurityGroupDto>> GetPermissionsAsync(CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<SecurityGroupDto>> GetTenantPermissionsAsync(Guid tenantId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="permission"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<string> GetPermissionGroupName(string permission, CancellationToken cancellationToken);
    }
}
