using Jupiter.Models.Dtos.Security.Permissions;

namespace Jupiter.BLL.Interfaces
{
    public interface IPermissionService
    {
        Task<bool> ManagePermissionsForTenantAsync(ManagePermissionsForTenantDto model, CancellationToken cancellationToken);
        Task<bool> ManagePermissionsAsync(ManagePermissionsDto permission, CancellationToken cancellationToken);
        Task<IEnumerable<SecurityGroupDto>> GetPermissionsAsync(CancellationToken cancellationToken);
        Task<IEnumerable<SecurityGroupDto>> GetTenantPermissionsAsync(CancellationToken cancellationToken);
    }
}
